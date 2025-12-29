import type { Article } from "../types/article";

export const MOCK_ARTICLES: Article[] = [
  {
    id: "a-1001",
    title: "Resetting an Agent Password",
    content:
      "To reset an agent password, navigate to Admin → Users → Agents, select the user, and choose Reset Password. The system will email a reset link if email is configured.",
    category: "Security",
    tags: ["password", "agent", "admin"],
    relevanceScore: 0.92,
    createdDate: "2025-09-10",
    lastUpdated: "2025-12-01",
    viewCount: 4200,
  },
  {
    id: "a-1002",
    title: "Single Sign-On (SSO) Troubleshooting",
    content:
      "If SSO fails, validate IdP metadata, ACS URL, certificate validity, and clock skew. Check auth logs for assertion errors and ensure the user is provisioned in the correct tenant.",
    category: "Security",
    tags: ["sso", "saml", "oidc", "troubleshooting"],
    relevanceScore: 0.88,
    createdDate: "2025-08-22",
    lastUpdated: "2025-11-15",
    viewCount: 7800,
  },
  {
    id: "a-1003",
    title: "Improving Knowledge Search Relevance",
    content:
      "Relevance can be improved by adding structured tags, maintaining clean categories, and ensuring titles contain user language. For semantic ranking, tune embeddings, apply re-ranking, and use click feedback loops.",
    category: "Performance",
    tags: ["search", "relevance", "ranking", "analytics"],
    relevanceScore: 0.95,
    createdDate: "2025-10-05",
    lastUpdated: "2025-12-10",
    viewCount: 12000,
  },
  {
    id: "a-1004",
    title: "Indexing Delay After Article Updates",
    content:
      "Article updates may take time to re-index. Verify the ingestion job queue, confirm the document version, and check indexing service health. Use backfill for large batches.",
    category: "Performance",
    tags: ["indexing", "ingestion", "queue"],
    relevanceScore: 0.83,
    createdDate: "2025-07-18",
    lastUpdated: "2025-10-20",
    viewCount: 2600,
  },
  {
    id: "a-1005",
    title: "Creating and Tagging Knowledge Articles",
    content:
      "When creating an article, include a concise title, customer-facing language, and 3–8 tags. Use consistent categories and add a short summary in the first paragraph for snippet generation.",
    category: "Knowledge",
    tags: ["authoring", "tags", "best-practices"],
    relevanceScore: 0.8,
    createdDate: "2025-06-30",
    lastUpdated: "2025-09-02",
    viewCount: 3400,
  },
  {
    id: "a-1006",
    title: "Filtering Results by Date Range",
    content:
      "Use date filters to narrow results to recently updated content. For best results, sort by date after filtering and confirm time zone normalization is applied consistently.",
    category: "Knowledge",
    tags: ["filters", "date", "sorting"],
    relevanceScore: 0.78,
    createdDate: "2025-11-02",
    lastUpdated: "2025-12-12",
    viewCount: 1900,
  },
  {
    id: "a-1007",
    title: "Understanding Role-Based Access Control (RBAC)",
    content:
      "RBAC controls which roles can view or edit knowledge content. Define roles by job function and scope access by tenant. Audit access changes and enforce least privilege.",
    category: "Security",
    tags: ["rbac", "roles", "permissions", "audit"],
    relevanceScore: 0.9,
    createdDate: "2025-05-14",
    lastUpdated: "2025-10-01",
    viewCount: 6100,
  },
  {
    id: "a-1008",
    title: "Knowledge Search Analytics: What to Track",
    content:
      "Track queries, click-through rates, zero-result searches, time-to-answer, and article helpfulness. Use analytics to identify content gaps and improve suggested answers.",
    category: "Analytics",
    tags: ["analytics", "metrics", "ctr", "gaps"],
    relevanceScore: 0.86,
    createdDate: "2025-09-28",
    lastUpdated: "2025-12-05",
    viewCount: 5300,
  },
  {
    id: "a-1009",
    title: "Handling Rate Limits for Downstream APIs",
    content:
      "When downstream APIs rate-limit, apply token-bucket limiting per tenant, use exponential backoff with jitter, and implement circuit breakers to protect the system.",
    category: "Performance",
    tags: ["rate-limit", "retry", "circuit-breaker"],
    relevanceScore: 0.84,
    createdDate: "2025-10-18",
    lastUpdated: "2025-12-08",
    viewCount: 4100,
  },
  {
    id: "a-1010",
    title: "Tenant Isolation Basics for Knowledge Data",
    content:
      "Ensure tenant isolation by scoping every query by tenantId, using row-level filters or separate indexes, and validating auth context at the API boundary.",
    category: "Security",
    tags: ["multi-tenancy", "isolation", "tenant"],
    relevanceScore: 0.82,
    createdDate: "2025-04-03",
    lastUpdated: "2025-08-19",
    viewCount: 2500,
  },
];
