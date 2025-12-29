import type { Article } from "../types/article";
import type { SearchFilters, SortBy } from "../types/search";
import { apiClient } from "./client";

/**
 * Knowledge API
 * -------------
 * UI-facing abstraction over backend endpoints.
 */
export const knowledgeApi = {
  getSuggestions(prefix: string, opts?: { signal?: AbortSignal }): Promise<string[]> {
    return apiClient.suggest(prefix, opts);
  },

  searchArticles(
  args: {
    query: string;
    filters: SearchFilters;
    sortBy: SortBy;
  },
  opts?: { signal?: AbortSignal }
): Promise<Article[]> {
  return apiClient.search(args, opts);
},


  getArticleById(id: string): Promise<Article> {
    return apiClient.getArticleById(id);
  },
};