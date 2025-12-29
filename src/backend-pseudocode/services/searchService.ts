import type { Article } from "../../types/article";
import type { SearchFilters, SortBy } from "../../types/search";
import { ArticleStore } from "../stores/articleStore";

/**
 * Utility: case-insensitive substring match
 */
function includesIgnoreCase(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * SearchService
 * - Encapsulates all search-related logic
 * - In production, this would query a search index (BM25 / vector / hybrid)
 */
export class SearchService {
  constructor(private store: ArticleStore) {}

  /**
   * Suggest article titles based on prefix
   */
  suggest(prefix: string): string[] {
    const q = prefix.trim();
    if (!q) return [];

    return this.store
      .list()
      .map((a) => a.title)
      .filter((title) => includesIgnoreCase(title, q))
      .slice(0, 5);
  }

  /**
   * Search articles with filters and sorting
   */
  search(args: {
    query: string;
    filters: SearchFilters;
    sortBy: SortBy;
  }): Article[] {
    const { query, filters, sortBy } = args;
    const q = query.trim();

    let results = this.store.list().filter((article) => {
      // Match query against title, content, or tags
      const matchesQuery =
        !q ||
        includesIgnoreCase(article.title, q) ||
        includesIgnoreCase(article.content, q) ||
        includesIgnoreCase(article.category, q) ||
        article.tags.some((t) => includesIgnoreCase(t, q));

      // Category filter
     const selectedCategory = (filters.category ?? "").trim();
     const matchesCategory =
        !selectedCategory ||
          includesIgnoreCase(article.category, selectedCategory); 

      // Date range filter (YYYY-MM-DD string compare works)
      const created = article.createdDate;
      const matchesFrom =
        !filters.fromDate || created >= filters.fromDate;
      const matchesTo =
        !filters.toDate || created <= filters.toDate;

      return matchesQuery && matchesCategory && matchesFrom && matchesTo;
    });

    // Sorting
    results.sort((a, b) => {
      if (sortBy === "relevance") {
        return b.relevanceScore - a.relevanceScore;
      }
      if (sortBy === "date") {
        return b.createdDate.localeCompare(a.createdDate);
      }
      // popularity
      return b.viewCount - a.viewCount;
    });

    return results;
  }
}
