export type SortBy = "relevance" | "date" | "popularity";

export type SearchFilters = {
  category?: string;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
};
