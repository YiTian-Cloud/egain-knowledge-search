type Props = {
  suggestions: string[];
  onSelect: (value: string) => void;
};

export default function SuggestionsList({ suggestions, onSelect }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <ul className="absolute z-10 mt-1 w-full rounded border bg-white shadow">
      {suggestions.map((s) => (
        <li
          key={s}
          className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault(); // ✅ prevent input blur
            onSelect(s);        // ✅ populate + search
          }}
        >
          {s}
        </li>
      ))}
    </ul>
  );
}
