import { api } from "@/lib/api";
import {
  PortfolioFilters,
  PortfolioListResponse,
  JobProfileStatus,
  CATEGORY_TO_BACKEND,
} from "@/types/portfolio";

export interface AdminPortfolioQuery extends PortfolioFilters {
  q?: string;
}

export const adminPortfolioService = {
  list: async (
    query: AdminPortfolioQuery,
    page: number = 0,
    size: number = 20
  ): Promise<PortfolioListResponse> => {
    const params = new URLSearchParams();

    if (query.q && query.q.trim().length > 0) {
      params.append("q", query.q.trim());
    }

    if (query.categories && query.categories.length > 0) {
      query.categories.forEach((cat) => {
        const backendCat = CATEGORY_TO_BACKEND[cat];
        if (backendCat) {
          params.append("categories", backendCat);
        }
      });
    }

    if (query.statuses && query.statuses.length > 0) {
      query.statuses.forEach((status: JobProfileStatus) => {
        params.append("statuses", status);
      });
    }

    params.append("page", page.toString());
    params.append("size", size.toString());

    const { data } = await api.get<PortfolioListResponse>(
      `/admin/portfolios?${params.toString()}`
    );
    return data;
  },

  deleteById: async (id: number): Promise<void> => {
    await api.delete(`/admin/portfolios/${id}`);
  },
};

export default adminPortfolioService;
