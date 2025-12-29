type Props = {
  items: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
};

export default function SearchHistory({ items, onSelect, onClear }: Props) {
  if (!items.length) return null;

  return (
<div
  style={{
    margin: "12px auto 0",
    maxWidth: 640,
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fafafa",
  }}
>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 12, color: "#6b7280" }}>Recent searches</div>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); 
            onClear();
          }}
          style={{
            fontSize: 12,
            color: "#6b7280",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((q) => (
          <button
            key={q}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault(); 
              onSelect(q);
            }}

            onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#e5e7eb";
            }}
            onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid #6366f1";
                e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = "none";
            }}
            style={{
              border: "1px solid #e5e7eb",
              background: "#fff",
              borderRadius: 999,
              padding: "6px 10px",
              fontSize: 13,
              cursor: "pointer",
            }}
            title={`Search "${q}"`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
