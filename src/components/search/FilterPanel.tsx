import { useEffect, useMemo, useState } from "react";

type Props = {
  title?: string;            // default: "Filters"
  isActive?: boolean;        // controls auto-open when active filters exist
  activeCount?: number;      // optional: show "2" instead of "Active"
  children: React.ReactNode;
};

export default function FilterPanel({
  title = "Filters",
  isActive = false,
  activeCount,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  // Auto-open if filters are active
  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  const chip = useMemo(() => {
    const n = typeof activeCount === "number" ? activeCount : isActive ? 1 : 0;
    return n > 0 ? n : null;
  }, [activeCount, isActive]);

  return (
    <div style={{ margin: "0 auto 18px", maxWidth: 640 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,

          // chip look
          padding: "8px 12px",
          borderRadius: 999,
          border: "1px solid #e5e7eb",
          background: open ? "#f9fafb" : "#ffffff",

          fontSize: 13,
          color: "#374151",
          cursor: "pointer",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = open ? "#f9fafb" : "#ffffff";
        }}
      >
        <span style={{ color: "#6b7280" }}>{title}</span>

        {chip !== null && (
          <span
            style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#111827",
            }}
            aria-label={`${chip} active filters`}
            title={`${chip} active filters`}
          >
            {chip}
          </span>
        )}

        <span
          aria-hidden="true"
          style={{
            marginLeft: 2,
            color: "#6b7280",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 120ms ease",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      <div
        style={{
          marginTop: 10,
          display: open ? "block" : "none",

          // subtle panel
          padding: "10px 10px",
          borderRadius: 14,
          border: "1px solid #eef2f7",
          background: "#fbfbfc",

          boxShadow: "0 1px 0 rgba(17,24,39,0.02)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
