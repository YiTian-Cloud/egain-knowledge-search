import { useEffect, useRef } from "react";
import type { SearchFilters, SortBy } from "../../types/search";

type Props = {
  filters: SearchFilters;
  sortBy: SortBy;
  categories: string[];
  onChangeFilters: (filters: SearchFilters) => void;
  onChangeSort: (sortBy: SortBy) => void;

  // keep these for compatibility with current SearchPage.tsx
  onApply: () => void;
  onClear: () => void;
};

function useDebouncedEffect(effect: () => void, deps: any[], delayMs: number) {
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = window.setTimeout(effect, delayMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function FiltersBar({
  filters,
  sortBy,
  categories,
  onChangeFilters,
  onChangeSort,
  onApply,
  onClear,
}: Props) {
  const hasActive =
    Boolean(filters.category) ||
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate) ||
    sortBy !== "relevance";

  // Auto-apply whenever filters/sort change (debounced)
  useDebouncedEffect(
    () => {
      onApply();
    },
    [filters.category, filters.fromDate, filters.toDate, sortBy],
    250
  );

  const controlStyle: React.CSSProperties = {
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: 999, // pill
    background: "#fff",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      {/* Category */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={labelStyle}>Category</div>
        <select
          value={filters.category ?? ""}
          onChange={(e) =>
            onChangeFilters({
              ...filters,
              category: e.target.value || undefined,
            })
          }
          style={{ ...controlStyle, minWidth: 180 }}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* From */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={labelStyle}>From</div>
        <input
          type="date"
          value={filters.fromDate ?? ""}
          onChange={(e) =>
            onChangeFilters({
              ...filters,
              fromDate: e.target.value || undefined,
            })
          }
          style={controlStyle}
        />
      </div>

      {/* To */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={labelStyle}>To</div>
        <input
          type="date"
          value={filters.toDate ?? ""}
          onChange={(e) =>
            onChangeFilters({
              ...filters,
              toDate: e.target.value || undefined,
            })
          }
          style={controlStyle}
        />
      </div>

      {/* Sort */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={labelStyle}>Sort</div>
        <select
          value={sortBy}
          onChange={(e) => onChangeSort(e.target.value as SortBy)}
          style={{ ...controlStyle, minWidth: 150 }}
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      {/* Clear as a quiet link */}
      {hasActive && (
        <button
          type="button"
          onMouseDown={(e) => {
            // prevent focus/blur weirdness when panel is open
            e.preventDefault();
            onClear();
          }}
          style={{
            marginLeft: 4,
            padding: "8px 6px",
            border: "none",
            background: "transparent",
            color: "#2563eb",
            fontSize: 13,
            cursor: "pointer",
            borderRadius: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
