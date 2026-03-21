import { useState, useCallback } from "react";
import {
  AdvancedFilterRequest,
  PortfolioDetail,
  Developer,
  detailToDeveloper,
  JobProfileStatus,
  GameEngine,
  JobCategory,
} from "@/types/portfolio";
import { advancedFilterService } from "@/services/advancedFilterService";

interface UseAdvancedFilterReturn {
  // State - Filter criteria
  jobCategories: JobCategory[];
  jobStatuses: JobProfileStatus[];
  skillNames: string[];
  minExperienceYears: number | null;
  maxExperienceYears: number | null;
  enginePreferences: GameEngine[];
  location: string | null;

  // State - Data
  developers: Developer[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasMore: boolean;

  // Actions - Setters
  setJobCategories: (cats: JobCategory[]) => void;
  setJobStatuses: (statuses: JobProfileStatus[]) => void;
  setSkillNames: (skills: string[]) => void;
  setExperienceRange: (min: number | null, max: number | null) => void;
  setEnginePreferences: (engines: GameEngine[]) => void;
  setLocation: (location: string | null) => void;

  // Actions - Operations
  applyFilters: (page?: number) => Promise<void>;
  clearAllFilters: () => void;
  loadMore: () => Promise<void>;
}

/**
 * Hook for managing advanced portfolio filtering
 * Handles state management and API communication for complex searches
 */
export function useAdvancedFilter(): UseAdvancedFilterReturn {
  // ====== Filter Criteria State ======
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [jobStatuses, setJobStatuses] = useState<JobProfileStatus[]>([]);
  const [skillNames, setSkillNames] = useState<string[]>([]);
  const [minExperienceYears, setMinExperienceYears] = useState<number | null>(null);
  const [maxExperienceYears, setMaxExperienceYears] = useState<number | null>(null);
  const [enginePreferences, setEnginePreferences] = useState<GameEngine[]>([]);
  const [location, setLocation] = useState<string | null>(null);

  // ====== Data State ======
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Apply filters and fetch results
   */
  const applyFilters = useCallback(
    async (page: number = 0) => {
      setLoading(true);
      setError(null);

      try {
        // Build request object with current filter state
        const request: AdvancedFilterRequest = {
          jobCategories,
          jobStatuses,
          skillNames,
          minExperienceYears,
          maxExperienceYears,
          enginePreferences,
          location,
          page,
          size: 20,
        };

        // Call API
        const response = await advancedFilterService.applyFilters(request);
        const devs = response.content.map(detailToDeveloper);

        if (page === 0) {
          // New search - replace results
          setDevelopers(devs);
        } else {
          // Load more - append results
          setDevelopers((prev) => {
            const merged = [...prev, ...devs];
            // Deduplicate by ID
            return Array.from(new Map(merged.map((d) => [d.id, d])).values());
          });
        }

        // Update pagination state
        setCurrentPage(response.number);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setHasMore(response.number < response.totalPages - 1);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to fetch portfolios";
        setError(errorMsg);
        console.error("Advanced filter error:", err);
      } finally {
        setLoading(false);
      }
    },
    [
      jobCategories,
      jobStatuses,
      skillNames,
      minExperienceYears,
      maxExperienceYears,
      enginePreferences,
      location,
    ]
  );

  /**
   * Load more results (pagination)
   */
  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await applyFilters(currentPage + 1);
    }
  }, [applyFilters, currentPage, hasMore, loading]);

  /**
   * Clear all filters and reset state
   */
  const clearAllFilters = useCallback(() => {
    setJobCategories([]);
    setJobStatuses([]);
    setSkillNames([]);
    setMinExperienceYears(null);
    setMaxExperienceYears(null);
    setEnginePreferences([]);
    setLocation(null);
    setDevelopers([]);
    setCurrentPage(0);
    setTotalPages(0);
    setTotalElements(0);
    setHasMore(true);
    setError(null);
  }, []);

  /**
   * Helper to set experience range
   */
  const setExperienceRange = useCallback(
    (min: number | null, max: number | null) => {
      setMinExperienceYears(min);
      setMaxExperienceYears(max);
    },
    []
  );

  return {
    // Filter criteria
    jobCategories,
    jobStatuses,
    skillNames,
    minExperienceYears,
    maxExperienceYears,
    enginePreferences,
    location,

    // Data
    developers,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    hasMore,

    // Setters
    setJobCategories,
    setJobStatuses,
    setSkillNames,
    setExperienceRange,
    setEnginePreferences,
    setLocation,

    // Operations
    applyFilters,
    clearAllFilters,
    loadMore,
  };
}
