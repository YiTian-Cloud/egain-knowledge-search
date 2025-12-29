import { useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;

  // focus control (for history/suggestions)
  onFocus?: () => void;
  onBlur?: () => void;

  // new
  onClear?: () => void;        // called when user clicks X
  onSpeechClick?: () => void;  // mic
  onImageClick?: () => void;   // camera/image
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  onClear,
  onSpeechClick,
  onImageClick,
}: Props) {
  
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = Boolean(value.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!hasValue) return;
        onSubmit?.();
      }}
      style={{ position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #e5e7eb",
          borderRadius: 999,
          padding: "8px 10px",
          background: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Search icon button (click instead of Enter) */}
        <button
          type="submit"
          disabled={!hasValue}
          onMouseDown={(e) => {
            // prevent the input from losing focus before submit handlers run
            e.preventDefault();
          }}
          aria-label="Search"
          title="Search"
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "none",
            background: "transparent",
            cursor: hasValue ? "pointer" : "not-allowed",
            display: "grid",
            placeItems: "center",
            opacity: hasValue ? 1 : 0.4,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M10 4a6 6 0 1 1 3.89 10.57l4.27 4.27-1.42 1.42-4.27-4.27A6 6 0 0 1 10 4m0 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8Z"
            />
          </svg>
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          autoComplete="off"
          enterKeyHint="search"
          aria-label="Search knowledge articles"
          inputMode="search"
          type="text"
          placeholder="Search knowledge articles…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            onFocus?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") e.currentTarget.blur();
          }}
          onBlur={() => setTimeout(() => onBlur?.(), 0)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 14,
            padding: "6px 4px",
          }}
        />

        {/* X clear */}
        {hasValue && (
          <button
            type="button"
            aria-label="Clear search"
            title="Clear"
            onMouseDown={(e) => {
              // keep input focused (prevents blur -> history panel flicker)
              e.preventDefault();
              onChange("");
              onClear?.();

              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              color: "#6b7280",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3z"
              />
            </svg>
          </button>
        )}

        {/* Mic */}
        <button
          type="button"
          aria-label="Voice search"
          title="Voice search"
          onMouseDown={(e) => {
            e.preventDefault();
            onSpeechClick?.();
          }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            color: "#6b7280",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3m5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z"
            />
          </svg>
        </button>

        {/* Image */}
        <button
          type="button"
          aria-label="Search by image"
          title="Search by image"
          onMouseDown={(e) => {
            e.preventDefault();
            onImageClick?.();
          }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            color: "#6b7280",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9 4L7.17 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.17L15 4H9m3 5a4 4 0 1 1 0 8a4 4 0 0 1 0-8Z"
            />
          </svg>
        </button>
      </div>

      {/* Optional: focus ring styling without Tailwind */}
      <style>{`
        form:focus-within > div {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.18);
        }
      `}</style>
    </form>
  );
}
