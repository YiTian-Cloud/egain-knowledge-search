import type { Article } from "../../types/article";
import { MOCK_ARTICLES } from "../../mocks/articles";

/**
 * In-memory Article Store
 * - Simulates a backend persistence layer
 * - In production, this would be backed by a database or search index
 */
export class ArticleStore {
  private byId = new Map<string, Article>();

  constructor(seed: Article[] = MOCK_ARTICLES) {
    seed.forEach((article) => {
      this.byId.set(article.id, article);
    });
  }

  list(): Article[] {
    return Array.from(this.byId.values());
  }

  getById(id: string): Article | undefined {
    return this.byId.get(id);
  }
}
