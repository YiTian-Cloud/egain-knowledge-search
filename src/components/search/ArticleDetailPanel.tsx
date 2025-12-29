import { useEffect, useState, type CSSProperties } from "react";
import type { Article } from "../../types/article";

type Props = {
  article: Article | null;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
};

export default function ArticleDetailPanel({ article, isSaved, onToggleSave, onClose }: Props) {

  const [menuOpen, setMenuOpen] = useState(false);

  const menuItemStyle: CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 13,
};


useEffect(() => {
  setMenuOpen(false); // close menu when article changes
}, [article?.id]);

const openInNewTab = () => {
  if (!article) return;

  const html = buildHtml(article);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) {
    //alert("Popup blocked. Please allow popups for this site.");
    URL.revokeObjectURL(url);
    return;
  }

  // clean up blob URL later
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

const printArticle = () => {
  if (!article) return;

  const html = buildHtml(article);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) {
    //alert("Popup blocked. Please allow popups for this site.");
    URL.revokeObjectURL(url);
    return;
  }

  const doPrint = () => {
    try {
      w.focus();
      w.print();
    } catch {}
  };

  // wait for the new document to load
  w.addEventListener("load", doPrint);
  setTimeout(doPrint, 400);

  // cleanup
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};


// helper
function buildHtml(a: Article) {
  const tags = (a.tags ?? []).map(t => `<span class="tag">${escapeHtml(String(t))}</span>`).join("");
const content = escapeHtml(String(a.content ?? "")).replace(/\n/g, "<br/>");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(a.title)}</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; line-height: 1.5; }
      h1 { font-size: 20px; margin: 0 0 12px; }
      .meta { color: #555; font-size: 13px; margin-bottom: 16px; }
      .tag { display: inline-block; margin-right: 8px; margin-bottom: 6px; padding: 2px 8px; border-radius: 999px; background: #dbeafe; color: #1d4ed8; font-size: 12px; }
      hr { margin: 16px 0; border: none; border-top: 1px solid #e5e7eb; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(a.title)}</h1>
    <div class="meta">
      <div><b>Category:</b> ${escapeHtml(a.category)}</div>
      <div><b>Created:</b> ${escapeHtml(a.createdDate)}</div>
      <div><b>Last Updated:</b> ${escapeHtml(a.lastUpdated)}</div>
      <div><b>Views:</b> ${String(a.viewCount)}</div>
    </div>
    <div>${tags}</div>
    <hr />
    <div>${content}</div>
  </body>
</html>`;
}



// minimal HTML escaping for the new-tab view
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

  // Close on ESC key
useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if (menuOpen) setMenuOpen(false);
      else onClose();
    }
  }
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [onClose, menuOpen]);

  useEffect(() => {
  if (!menuOpen) return;

  const onDocMouseDown = () => setMenuOpen(false);
  document.addEventListener("mousedown", onDocMouseDown);
  return () => document.removeEventListener("mousedown", onDocMouseDown);
}, [menuOpen]);


  if (!article) return null;

  return (
    <>
      {/* Backdrop ONLY on mobile (so it feels like a sheet) */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 9998,
          display: "block",
        }}
        className="egain-panel-backdrop"
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100dvh",
          width: "min(420px, 100vw)",
          background: "#fff",
          zIndex: 9999,
          borderLeft: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          overflowY: "auto",

          // slide-in
          transform: "translateX(0)",
          transition: "transform 160ms ease",
        }}
        className="egain-panel"
        aria-label="Article details"
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            borderBottom: "1px solid #f3f4f6",
            padding: 12,
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Mobile back button */}
            <button
              type="button"
              onClick={onClose}
              className="egain-mobile-back"
              style={{
                display: "none",
                border: "1px solid #e5e7eb",
                background: "#fff",
                borderRadius: 999,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              ← Back
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginBottom: 4,
                }}
              >
                {article.category}
              </div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={article.title}
              >
                {article.title}
              </h2>
            </div>

            {/* Save */}
<button
  type="button"
  onClick={() => onToggleSave(article.id)}
  aria-label={isSaved ? "Unsave article" : "Save article"}
  title={isSaved ? "Saved" : "Save"}
  style={{
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    flexShrink: 0,
  }}
>
  <span aria-hidden="true">{isSaved ? "★" : "☆"}</span>
  {isSaved ? "Saved" : "Save"}
</button>

{/* ⋯ menu */}
{/* ⋯ menu (desktop only) */}
<div className="desktopOnlyMenu" style={{ position: "relative" }}>

  <button
    type="button"
    aria-label="More actions"
    title="More"
    onClick={() => setMenuOpen((v) => !v)}
    style={{
      width: 34,
      height: 34,
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      background: "#fff",
      cursor: "pointer",
      fontSize: 18,
      lineHeight: "34px",
    }}
  >
    ⋯
  </button>

  {menuOpen && (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 40,
        width: 200,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        overflow: "hidden",
        zIndex: 10000,
      }}
      onMouseDown={(e) => e.preventDefault()} // keep focus stable
    >
      <button
        className="desktopOnlyMenuItem"
        type="button"
        onClick={() => {
          setMenuOpen(false);
          openInNewTab();
        }}
        style={menuItemStyle}
      >
        Open in new tab
      </button>

      <button
        className="desktopOnlyMenuItem"
        type="button"
        onClick={() => {
          setMenuOpen(false);
          printArticle();
        }}
        style={menuItemStyle}
      >
        Print
      </button>
    </div>
  )}
</div>


            {/* Close (always visible) */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 14, fontSize: 14, color: "#555" }}>
            <div>
              <strong>Created:</strong> {article.createdDate}
            </div>
            <div>
              <strong>Last Updated:</strong> {article.lastUpdated}
            </div>
            <div>
              <strong>Views:</strong> {article.viewCount}
            </div>
          </div>

          <div style={{ marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {article.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  borderRadius: 999,
                  background: "#eef2ff",
                  padding: "4px 10px",
                  fontSize: 12,
                  color: "#3730a3",
                  border: "1px solid #e5e7eb",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#111" }}>
            {article.content}
          </p>
        </div>
      </aside>

      {/* Responsive CSS (scoped via classNames above) */}
      <style>{`
        /* Desktop: docked panel, NO backdrop */
        @media (min-width: 900px) {
          .egain-panel-backdrop { display: none !important; }
          .egain-mobile-back { display: none !important; }
          .egain-panel {
            width: 420px !important;
            border-radius: 0 !important;
          }
        }

        /* Mobile: full screen sheet, show Back, keep backdrop */
        @media (max-width: 899px) {
          .egain-mobile-back { display: inline-flex !important; }
          .egain-panel {
            width: 100vw !important;
            max-width: 100vw !important;
            border-left: none !important;
          }
        }

        /* Hide desktop menu items on mobile */
        @media (max-width: 899px) {
          .desktopOnlyMenuItem { display: none !important; }
           .desktopOnlyMenu { display: none !important; }
        }

      `}</style>
    </>
  );
}
