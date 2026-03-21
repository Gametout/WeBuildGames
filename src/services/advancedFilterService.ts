import { api } from "@/lib/api";
import { AdvancedFilterRequest, PortfolioListResponse } from "@/types/portfolio";

/**
 * Advanced Portfolio Filter API Service
 * Handles all API calls related to advanced filtering
 */
export const advancedFilterService = {
  /**
   * Apply advanced filters to portfolio listings
   * POST /api/portfolio/filter
   *
   * @param request - Filter criteria from frontend
   * @returns Paginated list of matching portfolios
   */
  applyFilters: async (
    request: AdvancedFilterRequest
  ): Promise<PortfolioListResponse> => {
    const { data } = await api.post<PortfolioListResponse>(
      "/portfolio/filter",
      request
    );
    return data;
  },
};
