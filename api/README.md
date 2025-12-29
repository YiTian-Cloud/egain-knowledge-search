# Part 3 — API, Swagger & Metrics  
**eGain Knowledge Search Demo**

This document describes **Part 3** of the eGain Knowledge Search demo, focusing on:

- **API design & documentation**
- **Security and rate limiting**
- **High-volume analytics ingestion**
- **Observability & metrics visualization**

>  **Objective**  
> Showcase *enterprise-grade API patterns* and *observability thinking* —  
> not a production backend implementation.

---

## API Design Summary

### 1. Error Handling (Consistent & Predictable)
All endpoints return a normalized error envelope:

```json
{
  "error": {
    "code": "INVALID_ARGUMENT",
    "message": "query must be at least 1 character",
    "requestId": "req_123"
  }
}
Why this matters

Uniform client error handling

Clean Swagger documentation
Easy tracing across logs, metrics, and downstream services

2. Rate Limiting Strategy
Rate limiting is documented and surfaced via standard headers:

X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset

Retry-After (for 429 responses)

Design principles: Enforced per tenant and user
Separate budgets for:

Search
Suggestions
Analytics ingestion
Prevents abuse without impacting legitimate traffic

3. Authentication & Swagger “Try It Out”
All APIs are secured using JWT bearer authentication.

To support interactive testing, a demo-only auth endpoint is provided:

POST /api/v1/auth/token
Default credentials


{
  "clientId": "demo",
  "clientSecret": "demo-secret"
}
Response

{
  "accessToken": "<JWT>",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
➡️ Paste the token into Swagger’s Authorize dialog to unlock secured endpoints.

⚠️ This endpoint exists only for documentation and demo purposes.

4. High-Volume Analytics Ingestion
Analytics endpoints are designed for scale and isolation.

Key characteristics

Batch ingestion (POST /analytics/events)
Async acceptance (202 Accepted)
Idempotency via Idempotency-Key
Decoupled from user-facing APIs


5. Pagination Strategy
Search APIs use explicit page-based pagination.

Request
"pagination": { "page": 1, "pageSize": 20 }

Response

{
  "page": 1,
  "pageSize": 20,
  "total": 143,
  "results": []
}
Rationale

Predictable UI behavior

Stable analytics aggregation

Easy caching and rate-limit accounting

6. Metrics & Observability Dashboard
Route:


/metrics
Displayed metrics

Search volume trends

Top queries
Error rates
Agent interaction metrics (shown, accepted, rejected)
Implementation
Uses mock data, No backend dependency
Focuses on observability patterns, not data plumbing

This reflects how real analytics would be surfaced to product and ops teams.

7. Developer API Samples
Location:

api/samples/
Included files:

search.http
articles.http
analytics.http
saved.http

Each sample includes:

Auth flow
Headers and tokens
Sample requests
Sample responses

Compatible with:
VS Code REST Client
IntelliJ HTTP Client
Postman (manual import)

