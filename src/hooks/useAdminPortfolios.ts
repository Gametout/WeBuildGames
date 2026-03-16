import { useCallback, useEffect, useState } from "react";
import adminPortfolioService, { AdminPortfolioQuery } from "@/services/adminPortfolioService";
import { PortfolioDetail } from "@/types/portfolio";

interface UseAdminPortfoliosOptions {
  pageSize?: number;
}

export function useAdminPortfolios(options: UseAdminPortfoliosOptions = {}) {
  const { pageSize = 20 } = options;

  const [query, setQuery] = useState<AdminPortfolioQuery>({
    q: "",
    categories: [],
    statuses: [],
  });
  const [items, setItems] = useState<PortfolioDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetch = useCallback(
    async (nextPage: number = 0, nextQuery?: AdminPortfolioQuery) => {
      setLoading(true);
      setError(null);
      try {
        const effectiveQuery = nextQuery ?? query;
        const response = await adminPortfolioService.list(effectiveQuery, nextPage, pageSize);
        setItems(response.content);
        setPage(response.number);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || "Failed to fetch portfolios";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, query]
  );

  const remove = useCallback(async (id: number) => {
    await adminPortfolioService.deleteById(id);
  }, []);

  const updateQuery = useCallback((next: Partial<AdminPortfolioQuery>) => {
    setQuery((prev) => ({ ...prev, ...next }));
    setPage(0);
  }, []);

  const refresh = useCallback(async () => {
    await fetch(page);
  }, [fetch, page]);

  useEffect(() => {
    fetch(0, query);
  }, [query, fetch]);

  return {
    query,
    items,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    setPage,
    updateQuery,
    fetch,
    refresh,
    remove,
  };
}

export default useAdminPortfolios;
