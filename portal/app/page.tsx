export default function Home() {
  return (
    <main
      style={{
        padding: "48px 24px",
        maxWidth: 960,
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 40 }}>
      <h1
        style={{
        textAlign: "center",
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        marginBottom: 32,
        }}
      >
        <span style={{ color: "#111827" }}>eG</span>
        <span style={{ color: "#BB1290" }}>ai</span>
        <span style={{ color: "#111827" }}>n Knowledge Search</span>
      </h1>

        <p style={{ fontSize: 18, color: "#444", maxWidth: 720 }}>
          A production-style demo showcasing <b>AI-powered knowledge search</b>,
          <b> agent-assisted answers</b>, and <b>enterprise-grade APIs</b>.
        </p>
      </header>

      {/* Sections */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 28,
          background: "#fafcff",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          Demo Overview
        </h2>

        <ul style={{ lineHeight: 2, fontSize: 16 }}>
          <li>
            <b>Part 1 — Product Documentation:</b>{" "}
            <a href="/part1" style={linkStyle}>
              Knowledge Platform Overview
            </a>
          </li>

          <li>
            <b>Part 2 — AI Search Experience:</b>{" "}
            <a href="/part2" style={linkStyle}>
               Part 2 — Search UI Overview
            </a>
              {"  "}·{"  "}
            <a
              href="https://egain-knowledge-search.vercel.app"
              style={linkStyle}
              target="_blank"
              rel="noreferrer"
            >
              End-User Search Interface
            </a>
          </li>

          <li>
            <b>Part 3 — Platform APIs & Observability:</b>{" "}
  <a href="/part3" style={linkStyle}>
    Overview
  </a>
            {"  "}·{"  "}
            <a href="/docs" style={linkStyle}>
              Swagger API Docs
            </a>
            {"  "}·{"  "}
            <a href="/metrics" style={linkStyle}>
              Metrics & Agent Analytics
            </a>
            {"  "}·{"  "}

          </li>
                    <li>
            <b>Part 4 — Code Review Feedback and refactored code:</b>{" "}
  <a href="/part4.html" style={linkStyle}>
    Overview
  </a>

          </li>
                    <li>
            <b>Part 5 — Leadership Questions:</b>{" "}
  <a href="/part5.html" style={linkStyle}>
    Overview
  </a>

          </li>
          <li>
            <b>Part 6 — Demo Links:</b>{" "}
            <a href="/part6" style={linkStyle}>
              Deployment URLs
            </a>
          </li>
        </ul>
      </section>

      {/* Footer hint */}
      <footer style={{ marginTop: 32, fontSize: 14, color: "#666" }}>
        Built to demonstrate API design, security, observability, and AI-assisted
        knowledge workflows.
      </footer>
    </main>
  );
}

const linkStyle: React.CSSProperties = {
  textDecoration: "underline",
  color: "#0070f3",
  fontWeight: 500,
};
