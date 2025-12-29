import { ArticleStore } from "./stores/articleStore";
import { SearchService } from "./services/searchService";
import type { SearchFilters, SortBy } from "../types/search";

/**
 * Backend composition root
 * ------------------------
 * This file wires together stores and services.
 * In production, this would live behind an API Gateway / BFF
 * and be invoked via HTTP.
 */

// Initialize stores
const articleStore = new ArticleStore();

// Initialize services
const searchService = new SearchService(articleStore);

// Public backend interface (pseudo endpoints)
export const backend = {
  /**
   * GET /search
   */
  search: (args: {F
    query: string;
    filters: SearchFilters;
    sortBy: SortBy;
  }) => {
    return searchService.search(args);
  },

  /**
   * GET /suggest
   */
  suggest: (prefix: string) => {
    return searchService.suggest(prefix);
  },

  /**
   * GET /articles/{id}
   */
  getArticleById: (id: string) => {
    return articleStore.getById(id);
  },
};
