"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type SearchSummary = {
  window: { days: number };
  kpis: {
    totalSearches: number;
    errorRate: number;
    p95SearchMs: number;
    cacheHitRate: number;
  };
  timeseries: { day: string; searches: number; errors: number; p95Ms: number }[];
  topQueries: { query: string; count: number }[];
  topErrors: { code: string; count: number }[];
};

type AgentSummary = {
  window: { days: number };
  totals: {
    suggestionsShown: number;
    suggestionsClicked: number;
    suggestionsAccepted: number;
    suggestionsRejected: number;
    answersGenerated: number;
  };
  rates: {
    clickThroughRate: number;
    acceptanceRate: number;
    rejectionRate: number;
  };
  latencyMs: {
    retrieval: { p50: number; p95: number; p99: number };
    generation: { p50: number; p95: number; p99: number };
    endToEnd: { p50: number; p95: number; p99: number };
  };
  topSuggestedArticles: { articleId: string; title: string; count: number }[];
  timeseries: {
    day: string;
    suggestionsShown: number;
    suggestionsClicked: number;
    suggestionsAccepted: number;
    suggestionsRejected: number;
    answersGenerated: number;
  }[];
};

function pct(x: number) {
  return `${(x * 100).toFixed(1)}%`;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default function MetricsPage() {
  const [search, setSearch] = useState<SearchSummary | null>(null);
  const [agent, setAgent] = useState<AgentSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const [a, b] = await Promise.all([
        fetch("/api/v1/metrics/summary", { cache: "no-store" }),
        fetch("/api/v1/metrics/agent/summary", { cache: "no-store" }),
      ]);

      if (!a.ok) throw new Error(`metrics/summary failed (${a.status})`);
      if (!b.ok) throw new Error(`metrics/agent/summary failed (${b.status})`);

      setSearch(await a.json());
      setAgent(await b.json());
    } catch (e: any) {
      setError(e?.message ?? "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const searchChartData = useMemo(() => search?.timeseries ?? [], [search]);
  const agentChartData = useMemo(() => agent?.timeseries ?? [], [agent]);

  return (
        <div style={{ padding: 24 }}>
      {/* Back link */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/" style={{ textDecoration: "none", color: "#2563eb" }}>
          ← Back to Home
        </Link>
      </div>

    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Observability Dashboard</h1>
          <p className="text-sm opacity-80">
            Search performance, top queries, error mix, and agent interaction metrics (mock data; secured endpoints).
          </p>
        </div>

        <button
          onClick={load}
          className="rounded-lg border px-3 py-2 text-sm hover:opacity-80"
          disabled={loading}
          title="Refresh"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="rounded-xl border p-4">
          <div className="font-medium">Couldn’t load metrics</div>
          <div className="text-sm opacity-80 mt-1">{error}</div>
          <div className="text-sm opacity-80 mt-2">
            If this is 401, go to Swagger, Authorize with JWT, or verify your auth/session behavior.
          </div>
        </div>
      )}

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi title="Total searches (14d)" value={search ? fmt(search.kpis.totalSearches) : "—"} />
        <Kpi title="Error rate" value={search ? pct(search.kpis.errorRate) : "—"} />
        <Kpi title="P95 search latency" value={search ? `${fmt(search.kpis.p95SearchMs)} ms` : "—"} />
        <Kpi title="Cache hit rate" value={search ? pct(search.kpis.cacheHitRate) : "—"} />
      </section>

      {/* Search charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Search volume (daily)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={searchChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="searches" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Errors + P95 latency (daily)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={searchChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="errors" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="p95Ms" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Tables */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Top queries">
          <SimpleTable
            headers={["Query", "Count"]}
            rows={(search?.topQueries ?? []).map((r) => [r.query, fmt(r.count)])}
          />
        </Card>

        <Card title="Top errors">
          <SimpleTable
            headers={["Error code", "Count"]}
            rows={(search?.topErrors ?? []).map((r) => [r.code, fmt(r.count)])}
          />
        </Card>
      </section>

      {/* Agent section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Agent totals (14d)">
          <div className="space-y-2 text-sm">
            <Row label="Suggestions shown" value={agent ? fmt(agent.totals.suggestionsShown) : "—"} />
            <Row label="Suggestions clicked" value={agent ? fmt(agent.totals.suggestionsClicked) : "—"} />
            <Row label="Accepted" value={agent ? fmt(agent.totals.suggestionsAccepted) : "—"} />
            <Row label="Rejected" value={agent ? fmt(agent.totals.suggestionsRejected) : "—"} />
            <Row label="Answers generated" value={agent ? fmt(agent.totals.answersGenerated) : "—"} />
            <hr className="my-3 opacity-30" />
            <Row label="Click-through rate" value={agent ? pct(agent.rates.clickThroughRate) : "—"} />
            <Row label="Acceptance rate" value={agent ? pct(agent.rates.acceptanceRate) : "—"} />
            <Row label="Rejection rate" value={agent ? pct(agent.rates.rejectionRate) : "—"} />
          </div>
        </Card>

        <Card title="Latency percentiles (ms)">
          <div className="space-y-3 text-sm">
            <LatencyBlock title="Retrieval" v={agent?.latencyMs.retrieval} />
            <LatencyBlock title="Generation" v={agent?.latencyMs.generation} />
            <LatencyBlock title="End-to-end" v={agent?.latencyMs.endToEnd} />
          </div>
        </Card>

        <Card title="Top suggested articles">
          <SimpleTable
            headers={["Title", "Count"]}
            rows={(agent?.topSuggestedArticles ?? []).map((r) => [r.title, fmt(r.count)])}
          />
        </Card>
      </section>

      <Card title="Agent interactions (daily)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="suggestionsShown" />
              <Bar dataKey="suggestionsAccepted" />
              <Bar dataKey="answersGenerated" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-sm opacity-75">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="opacity-70">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left font-medium py-2 border-b">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="py-3 opacity-70" colSpan={headers.length}>
                No data
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                {r.map((c, i) => (
                  <td key={i} className="py-2">
                    {c}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="opacity-75">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function LatencyBlock({ title, v }: { title: string; v?: { p50: number; p95: number; p99: number } }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="font-medium mb-2">{title}</div>
      <div className="space-y-1">
        <Row label="p50" value={v ? `${fmt(v.p50)} ms` : "—"} />
        <Row label="p95" value={v ? `${fmt(v.p95)} ms` : "—"} />
        <Row label="p99" value={v ? `${fmt(v.p99)} ms` : "—"} />
      </div>
    </div>
  );
}
