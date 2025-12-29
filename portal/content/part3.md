<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Part 3 — API, Swagger & Metrics | eGain Knowledge Search Demo</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --egain-blue: #0052cc;
      --egain-light: #f5f7fb;
      --egain-text: #1f2937;
      --egain-muted: #6b7280;
      --egain-border: #e5e7eb;
      --code-bg: #0f172a;
      --code-text: #e5e7eb;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;
      color: var(--egain-text);
      background: var(--egain-light);
      line-height: 1.6;
    }

    main {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 24px 72px;
      background: #ffffff;
    }

    h1 {
      font-size: 2.25rem;
      margin-bottom: 0.25em;
      color: var(--egain-blue);
    }

    h2 {
      margin-top: 3rem;
      font-size: 1.5rem;
      border-bottom: 1px solid var(--egain-border);
      padding-bottom: 0.25rem;
    }

    h3 {
      margin-top: 2rem;
      font-size: 1.15rem;
      color: #111827;
    }

    p {
      margin: 0.75rem 0;
    }

    ul {
      margin: 0.75rem 0 0.75rem 1.25rem;
    }

    li {
      margin: 0.4rem 0;
    }

    .subtitle {
      color: var(--egain-muted);
      margin-bottom: 1.5rem;
    }

    .objective {
      background: #f0f6ff;
      border-left: 4px solid var(--egain-blue);
      padding: 16px 20px;
      margin: 24px 0;
    }

    code,
    pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", monospace;
    }

    pre {
      background: var(--code-bg);
      color: var(--code-text);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.9rem;
      margin: 16px 0;
    }

    .tag {
      display: inline-block;
      background: #eef2ff;
      color: #3730a3;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      margin-right: 8px;
    }

    .section-note {
      background: #fafafa;
      border: 1px solid var(--egain-border);
      padding: 14px 16px;
      border-radius: 6px;
      margin-top: 12px;
    }

    footer {
      margin-top: 64px;
      padding-top: 16px;
      border-top: 1px solid var(--egain-border);
      color: var(--egain-muted);
      font-size: 0.85rem;
      text-align: center;
    }

    a {
      color: var(--egain-blue);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <main>
    <h1>Part 3 — API, Swagger & Metrics</h1>
    <p class="subtitle"><strong>eGain Knowledge Search Demo</strong></p>

    <p>
      This page describes <strong>Part 3</strong> of the eGain Knowledge Search demo,
      focusing on API design quality, security, and observability.
    </p>

    <ul>
      <li><strong>API design & documentation</strong></li>
      <li><strong>Security and rate limiting</strong></li>
      <li><strong>High-volume analytics ingestion</strong></li>
      <li><strong>Observability & metrics visualization</strong></li>
    </ul>

    <div class="objective">
      <strong>Objective</strong><br />
      Showcase <em>enterprise-grade API patterns</em> and
      <em>observability thinking</em> — not a production backend implementation.
    </div>

    <h2>API Design Summary</h2>

    <h3>1. Error Handling (Consistent & Predictable)</h3>
    <p>
      All endpoints return a normalized error envelope, ensuring consistency
      across clients and services:
    </p>

    <pre>{
  "error": {
    "code": "INVALID_ARGUMENT",
    "message": "query must be at least 1 character",
    "requestId": "req_123"
  }
}</pre>

    <ul>
      <li>Uniform client-side error handling</li>
      <li>Clean Swagger documentation</li>
      <li>Easy tracing across logs, metrics, and downstream services</li>
    </ul>

    <h3>2. Rate Limiting Strategy</h3>
    <p>
      Rate limiting is explicitly documented and surfaced through standard HTTP headers:
    </p>

    <ul>
      <li><code>X-RateLimit-Limit</code></li>
      <li><code>X-RateLimit-Remaining</code></li>
      <li><code>X-RateLimit-Reset</code></li>
      <li><code>Retry-After</code> (for 429 responses)</li>
    </ul>

    <div class="section-note">
      <strong>Design principles</strong>
      <ul>
        <li>Enforced per tenant and per user</li>
        <li>Separate budgets for search, suggestions, and analytics ingestion</li>
        <li>Protects system health without harming legitimate traffic</li>
      </ul>
    </div>

    <h3>3. Authentication & Swagger “Try It Out”</h3>
    <p>
      All APIs are secured using <strong>JWT bearer authentication</strong>.
      To support interactive testing, a demo-only token endpoint is provided:
    </p>

    <pre>POST /api/v1/auth/token</pre>

    <p><strong>Default demo credentials</strong></p>
    <pre>{
  "clientId": "demo",
  "clientSecret": "demo-secret"
}</pre>

    <p><strong>Token response</strong></p>
    <pre>{
  "accessToken": "&lt;JWT&gt;",
  "tokenType": "Bearer",
  "expiresIn": 3600
}</pre>

    <p>
      Paste the token into Swagger’s <strong>Authorize</strong> dialog to unlock secured endpoints.
    </p>

    <p class="section-note">
      ⚠️ This authentication flow exists only for documentation and demo purposes.
    </p>

    <h3>4. High-Volume Analytics Ingestion</h3>
    <p>
      Analytics endpoints are designed for scale and isolation:
    </p>

    <ul>
      <li>Batch ingestion (<code>POST /analytics/events</code>)</li>
      <li>Async acceptance (<code>202 Accepted</code>)</li>
      <li>Idempotency via <code>Idempotency-Key</code></li>
      <li>Decoupled from user-facing latency</li>
    </ul>

    <h3>5. Pagination Strategy</h3>
    <p>Search APIs use explicit page-based pagination.</p>

    <p><strong>Request</strong></p>
    <pre>{
  "pagination": { "page": 1, "pageSize": 20 }
}</pre>

    <p><strong>Response</strong></p>
    <pre>{
  "page": 1,
  "pageSize": 20,
  "total": 143,
  "results": []
}</pre>

    <ul>
      <li>Predictable UI behavior</li>
      <li>Stable analytics aggregation</li>
      <li>Easy caching and rate-limit accounting</li>
    </ul>

    <h3>6. Metrics & Observability Dashboard</h3>
    <p>
      The demo includes a metrics page exposed at:
    </p>

    <pre>/metrics</pre>

    <p><strong>Displayed metrics</strong></p>
    <ul>
      <li>Search volume trends</li>
      <li>Top queries</li>
      <li>Error rates</li>
      <li>Agent interaction metrics (shown / accepted / rejected)</li>
    </ul>

    <p>
      The dashboard uses mock data and focuses on observability patterns,
      not backend data plumbing.
    </p>

    <h3>7. Developer API Samples</h3>
    <p>
      Sample HTTP requests are provided under:
    </p>

    <pre>api/samples/</pre>

    <ul>
      <li><code>search.http</code></li>
      <li><code>articles.http</code></li>
      <li><code>analytics.http</code></li>
      <li><code>saved.http</code></li>
    </ul>

    <p>
      Each file includes authentication, headers, sample requests, and
      representative responses. Compatible with VS Code REST Client,
      IntelliJ HTTP Client, and Postman.
    </p>

    <footer>
      eGain Knowledge Search Demo · Part 3 — API, Swagger & Metrics
    </footer>
  </main>
</body>
</html>
