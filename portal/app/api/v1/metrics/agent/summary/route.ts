import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // const auth = await requireAuth(req);
  // if (!auth.ok) return auth.res;

  const now = Date.now();
  const buckets = Array.from({ length: 14 }).map((_, i) => {
    const day = new Date(now - (13 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10);
    const shown = 1200 + Math.floor(Math.random() * 600);
    const clicked = Math.floor(shown * (0.25 + Math.random() * 0.12));
    const accepted = Math.floor(shown * (0.12 + Math.random() * 0.10));
    const rejected = Math.floor(shown * (0.05 + Math.random() * 0.08));
    const answers = 400 + Math.floor(Math.random() * 240);
    return { day, suggestionsShown: shown, suggestionsClicked: clicked, suggestionsAccepted: accepted, suggestionsRejected: rejected, answersGenerated: answers };
  });

  const totals = buckets.reduce(
    (acc, b) => {
      acc.suggestionsShown += b.suggestionsShown;
      acc.suggestionsClicked += b.suggestionsClicked;
      acc.suggestionsAccepted += b.suggestionsAccepted;
      acc.suggestionsRejected += b.suggestionsRejected;
      acc.answersGenerated += b.answersGenerated;
      return acc;
    },
    { suggestionsShown: 0, suggestionsClicked: 0, suggestionsAccepted: 0, suggestionsRejected: 0, answersGenerated: 0 }
  );

  const rates = {
    clickThroughRate: totals.suggestionsShown ? totals.suggestionsClicked / totals.suggestionsShown : 0,
    acceptanceRate: totals.suggestionsShown ? totals.suggestionsAccepted / totals.suggestionsShown : 0,
    rejectionRate: totals.suggestionsShown ? totals.suggestionsRejected / totals.suggestionsShown : 0,
  };

  const topSuggestedArticles = [
    { articleId: "a_123", title: "Resetting Passwords", count: 420 },
    { articleId: "a_456", title: "SSO Troubleshooting", count: 315 },
    { articleId: "a_789", title: "MFA Enrollment", count: 270 },
  ];

  return NextResponse.json({
    window: { days: 14 },
    totals,
    rates,
    latencyMs: {
      retrieval: { p50: 85, p95: 240, p99: 420 },
      generation: { p50: 620, p95: 1800, p99: 2600 },
      endToEnd: { p50: 740, p95: 2100, p99: 3100 },
    },
    topSuggestedArticles,
    timeseries: buckets,
  });
}
