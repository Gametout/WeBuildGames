import { useState, useEffect, useCallback, useRef } from "react";
import { portfolioService } from "@/services/portfolioService";
import {
  PortfolioDetail,
  Developer,
  detailToDeveloper,
  JobCategory,
  JobProfileStatus,
  PortfolioFilters,
  BACKEND_TO_CATEGORY,
} from "@/types/portfolio";

interface UsePortfoliosOptions {
  category?: string;              // Legacy single category support
  categories?: string[];          // Multiple categories (new)
  statuses?: JobProfileStatus[];  // Multiple statuses (new)
  initialPage?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UsePortfoliosReturn {
  developers: Developer[];
  portfolios: PortfolioDetail[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  fetchPortfolios: (category?: string, page?: number) => Promise<void>;
  fetchWithFilters: (filters: PortfolioFilters, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  getByCategory: (category: string) => Developer[];
}

/**
 * Hook for fetching and managing portfolio listings
 * Handles pagination, caching, and category/status filtering
 * 
 * Supports both legacy single-category mode and new multi-filter mode
 */
export function usePortfolios(options: UsePortfoliosOptions = {}): UsePortfoliosReturn {
  const {
    category = "All",
    categories = [],
    statuses = [],
    initialPage = 0,
    pageSize = 20,
    autoFetch = true,
  } = options;

  const [portfolios, setPortfolios] = useState<PortfolioDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Track current filters for loadMore
  const currentFiltersRef = useRef<PortfolioFilters>({ categories: [], statuses: [] });

  // Simple cache - store by filter key
  const cacheRef = useRef<Map<string, PortfolioDetail[]>>(new Map());

  // Generate cache key from filters
  const getCacheKey = (filters: PortfolioFilters): string => {
    return `${filters.categories.sort().join(',')}|${filters.statuses.sort().join(',')}`;
  };

  /**
   * Fetch portfolios with multiple filters (new method)
   */
  const fetchWithFilters = useCallback(
    async (filters: PortfolioFilters, page: number = 0) => {
      setLoading(true);
      setError(null);
      currentFiltersRef.current = filters;

      try {
        // If no filters selected, use listAll
        const hasCategories = filters.categories.length > 0;
        const hasStatuses = filters.statuses.length > 0;
        const hasFilters = hasCategories || hasStatuses;
        
        // When categories are selected but statuses are empty, default to OPEN
        // This prevents 400 errors from backend expecting at least one status
        const effectiveFilters: PortfolioFilters = {
          categories: filters.categories,
          statuses: (hasCategories && !hasStatuses) 
            ? [JobProfileStatus.OPEN] 
            : filters.statuses,
        };
        
        const response = hasFilters
          ? await portfolioService.listByFilters(effectiveFilters, page, pageSize)
          : await portfolioService.listAll(page, pageSize);
        
        const newPortfolios = response.content;
        const cacheKey = getCacheKey(filters);

        if (page === 0) {
          setPortfolios(newPortfolios);
          cacheRef.current.set(cacheKey, newPortfolios);
        } else {
          setPortfolios((prev) => {
            const merged = [...prev, ...newPortfolios];
            const unique = Array.from(
              new Map(merged.map((p) => [p.id, p])).values()
            );
            cacheRef.current.set(cacheKey, unique);
            return unique;
          });
        }

        setCurrentPage(response.number);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setHasMore(!response.last);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch portfolios";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  /**
   * Legacy single-category fetch (backwards compatible)
   */
  const fetchPortfolios = useCallback(
    async (cat: string = category, page: number = 0) => {
      // Convert single category to filters format
      const filters: PortfolioFilters = {
        categories: cat === "All" ? [] : [cat],
        statuses: [],
      };
      await fetchWithFilters(filters, page);
    },
    [category, fetchWithFilters]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchWithFilters(currentFiltersRef.current, currentPage + 1);
  }, [fetchWithFilters, currentPage, hasMore, loading]);

  const refresh = useCallback(async () => {
    cacheRef.current.clear();
    await fetchWithFilters(currentFiltersRef.current, 0);
  }, [fetchWithFilters]);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    if (autoFetch) {
      // Determine filters from options
      const filters: PortfolioFilters = {
        categories: categories.length > 0 ? categories : (category === "All" ? [] : [category]),
        statuses: statuses,
      };

      const cacheKey = getCacheKey(filters);
      const cached = cacheRef.current.get(cacheKey);
      
      if (cached && cached.length > 0) {
        setPortfolios(cached);
        setTotalElements(cached.length);
        setTotalPages(Math.ceil(cached.length / pageSize));
        setHasMore(pageSize < cached.length);
        currentFiltersRef.current = filters;
      } else {
        fetchWithFilters(filters, 0);
      }
    }
  }, [category, JSON.stringify(categories), JSON.stringify(statuses), autoFetch, fetchWithFilters, pageSize]);

  // Transform portfolios to developers for UI
  const developers: Developer[] = portfolios.map((p) => {
    const dev = detailToDeveloper(p);
    dev.category = BACKEND_TO_CATEGORY[p.jobCategory] || "Other";
    return dev;
  });

  const getByCategory = useCallback(
    (cat: string): Developer[] => {
      if (cat === "All") return developers;
      return developers.filter((d) => d.category === cat);
    },
    [developers]
  );

  return {
    developers,
    portfolios,
    loading,
    error,
    hasMore,
    currentPage,
    totalPages,
    totalElements,
    fetchPortfolios,
    fetchWithFilters,
    loadMore,
    refresh,
    getByCategory,
  };
}

/**
 * Hook for fetching portfolios by multiple categories (for Netflix-style rails)
 * Updated to work with the new service
 */
export function usePortfolioRails() {
  const [rails, setRails] = useState<Record<string, Developer[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use MAJOR_CATEGORIES from the service for consistency
      const MAJOR_CATEGORIES = [
        JobCategory.PROGRAMMER,
        JobCategory.ARTIST,
        JobCategory.DESIGNER,
        JobCategory.PRODUCT_MANAGER,
        JobCategory.PRODUCER,
      ];

      // Fetch main categories in parallel
      const requests = MAJOR_CATEGORIES.map(cat =>
        portfolioService.getByCategory(cat, 0, 8)
      );

      const responses = await Promise.all(requests);

      // Build rails dynamically from responses
      const newRails: Record<string, Developer[]> = {};

      // Featured rail (premium from all categories)
      const allContent = responses.flatMap(r => r.content);
      const premium = allContent.filter(p => p.isPremium);
      const nonPremium = allContent.filter(p => !p.isPremium);
      newRails["Elite Operatives"] = [...premium, ...nonPremium]
        .slice(0, 6)
        .map(detailToDeveloper);

      // Category rails
      const categoryNames = {
        [JobCategory.PROGRAMMER]: "Engineering Division",
        [JobCategory.ARTIST]: "Visual Arts Corps",
        [JobCategory.DESIGNER]: "Design Guild",
        [JobCategory.PRODUCT_MANAGER]: "Product Management",
        [JobCategory.PRODUCER]: "Production Unit",
      };

      responses.forEach((response, index) => {
        const category = MAJOR_CATEGORIES[index];
        const railName = categoryNames[category] || `${BACKEND_TO_CATEGORY[category]}s`;
        newRails[railName] = response.content.map(detailToDeveloper);
      });

      setRails(newRails);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch portfolio rails";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRails();
  }, [fetchRails]);

  return { rails, loading, error, refresh: fetchRails };
}

// Default export for usePortfolios
export default usePortfolios;