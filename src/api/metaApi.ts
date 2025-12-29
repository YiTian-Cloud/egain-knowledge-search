import { backend } from "../backend-pseudocode";

export const metaApi = {
  async listCategories(): Promise<string[]> {
    // backend.search not needed; just read store via existing backend results
    // We can derive categories from all documents by calling a search with empty query.
    const all = backend.search({
      query: "",
      filters: {},
      sortBy: "relevance",
    });

    const categories = Array.from(new Set(all.map((a) => a.category)));
    categories.sort();
    return categories;
  },
};
