import Swagger from "./Swagger";
import Link from "next/link";

export default function DocsPage() {
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
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
         <span style={{ color: "#111827" }}>eG</span>
        <span style={{ color: "#BB1290" }}>ai</span>
        <span style={{ color: "#111827" }}>n API Docs (OpenAPI)</span>
      </h1>
      <Swagger />
    </main>
    </div>
  );
}
