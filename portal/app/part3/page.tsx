import Link from "next/link";

export default function Part3Overview() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Back link */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          background: "#fafafa",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "#2563eb" }}>
          ← Back to Home
        </Link>
      </div>

      {/* Content */}
      <iframe
        src="/part3.html"
        style={{
          flex: 1,
          border: "none",
          background: "#ffffff",
        }}
        title="Part 3 — API, Swagger & Metrics"
      />
    </div>
  );
}
