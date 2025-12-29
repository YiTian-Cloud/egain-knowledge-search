import { useEffect, useState } from "react";

/**
 * useDebouncedValue
 * -----------------
 * Returns a debounced version of a value after `delay` ms.
 * Used for search suggestions and query execution.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
