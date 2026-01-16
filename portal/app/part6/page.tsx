export default function Part6() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Part 6 — Demo Links</h1>
        <p style={{ color: "#555", marginTop: 8 }}>
          Public URLs for the search interface SPA and analytics dashboard demo.
        </p>
        <a href="/" style={{ textDecoration: "underline" }}>
          ← Back to Portal
        </a>
      </div>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          background: "#fafcff",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Search Interface (SPA)
        </h2>
        <p style={{ color: "#444", marginBottom: 12 }}>
          Deployed to OCI Object Storage (PSA to OCI) and served behind a Cloudflare CDN.
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            Cloudflare CDN:{" "}
            <a
              href="https://oci-space-proxy.ytian98.workers.dev/"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "underline" }}
            >
              https://oci-space-proxy.ytian98.workers.dev/
            </a>
          </li>
          <li>
            OCI Object Storage:{" "}
            <a
              href="https://objectstorage.us-sanjose-1.oraclecloud.com/p/vLpIdbF7I_4UWsU_2nz5m98zavHhOKsNG6rO1zgtsBKBUwF-npKAZO97aU58Uvzk/n/axeci9vfounk/b/vite-app-bucket/o/index.html"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "underline" }}
            >
              objectstorage.us-sanjose-1.oraclecloud.com/.../index.html
            </a>
          </li>
        </ul>
      </section>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
          background: "#fff7f2",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Analytics Dashboard
        </h2>
        <p style={{ color: "#444", marginBottom: 12 }}>
          Analytics pipeline + dashboard deployed on OKE with ClickHouse and rollups.
        </p>
        <a
          href="http://163.192.35.44:7073"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline" }}
        >
          http://163.192.35.44:7073
        </a>
      </section>
    </main>
  );
}
