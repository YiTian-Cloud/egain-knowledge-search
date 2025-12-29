import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // const auth = await requireAuth(req);
  // if (!auth.ok) return auth.res;

  // Mock “search observability” summary
  const now = Date.now();
  const buckets = Array.from({ length: 14 }).map((_, i) => {
    const day = new Date(now - (13 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10);
    const searches = 800 + Math.floor(Math.random() * 400);
    const errors = Math.floor(searches * (0.01 + Math.random() * 0.02));
    const p95 = 180 + Math.floor(Math.random() * 160);
    return { day, searches, errors, p95Ms: p95 };
  });

  const totalSearches = buckets.reduce((s, b) => s + b.searches, 0);
  const totalErrors = buckets.reduce((s, b) => s + b.errors, 0);

  const topQueries = [
    { query: "password reset", count: 860 },
    { query: "sso login failed", count: 540 },
    { query: "vpn not connecting", count: 420 },
    { query: "account locked", count: 390 },
    { query: "mfa enrollment", count: 355 },
  ];

  const topErrors = [
    { code: "RATE_LIMITED", count: 92 },
    { code: "UPSTREAM_TIMEOUT", count: 61 },
    { code: "INVALID_ARGUMENT", count: 48 },
    { code: "INDEX_UNAVAILABLE", count: 21 },
  ];

  return NextResponse.json({
    window: { days: 14 },
    kpis: {
      totalSearches,
      errorRate: totalSearches ? totalErrors / totalSearches : 0,
      p95SearchMs: Math.max(...buckets.map((b) => b.p95Ms)),
      cacheHitRate: 0.62 + Math.random() * 0.12,
    },
    timeseries: buckets,
    topQueries,
    topErrors,
  });
}
