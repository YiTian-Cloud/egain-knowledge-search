export type Article = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevanceScore: number;
  createdDate: string;   // ISO date string (YYYY-MM-DD)
  lastUpdated: string;   // ISO date string
  viewCount: number;
};
