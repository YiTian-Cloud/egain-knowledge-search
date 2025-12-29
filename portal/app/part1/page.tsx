export default function Part1() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>
          Part 1 — Product & Architecture Design
        </h1>

        <p style={{ color: "#555", marginTop: 8 }}>
          System architecture, scalability strategy, security model, and trade-off analysis
          for the eGain Knowledge Search platform.
        </p>

        <div style={{ marginTop: 12 }}>
          <a href="/" style={{ marginRight: 16, textDecoration: "underline" }}>
            ← Back to Portal
          </a>

          <a
            href="/part1-architecture.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Download PDF
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
          height: "80vh",
        }}
      >
        <iframe
          src="/part1-architecture.pdf"
          title="Part 1 Architecture PDF"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>

      {/* Fallback text */}
      <p style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
        If the PDF does not render correctly in your browser, use the{" "}
        <a href="/part1-architecture.pdf" target="_blank" style={{ textDecoration: "underline" }}>
          download link
        </a>.
      </p>
    </main>
  );
}
