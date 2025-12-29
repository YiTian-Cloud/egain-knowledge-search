import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { metaApi } from "../api/metaApi";
import FiltersBar from "../components/search/FiltersBar";
import { knowledgeApi } from "../api/knowledgeApi";
import SearchBar from "../components/search/SearchBar";
import SuggestionsList from "../components/search/SuggestionsList";
import ResultsList from "../components/search/ResultsList";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  initialSearchState,
  searchReducer,
} from "../state/searchStore";

import ArticleDetailPanel from "../components/search/ArticleDetailPanel";
import SearchHistory from "../components/search/SearchHistory";
import FilterPanel from "../components/search/FilterPanel";


export default function SearchPage() {
  const [state, dispatch] = useReducer(
    searchReducer,
    initialSearchState
  );

  const [categories, setCategories] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const suggestAbortRef = useRef<AbortController | null>(null);


  const debouncedQuery = useDebouncedValue(state.query, 300);

  // Instant clear: when query becomes empty, clear suggestions immediately (no debounce delay)
useEffect(() => {
  if (!state.query.trim()) {
    suggestAbortRef.current?.abort(); // abort immediately
    suggestAbortRef.current = null;
    dispatch({ type: "SET_SUGGESTIONS", suggestions: [] });
  }
}, [state.query]);


  // Fetch suggestions
useEffect(() => {
  const q = debouncedQuery.trim();

  // Always abort previous request first
  suggestAbortRef.current?.abort();

  if (!q) {
    suggestAbortRef.current = null;
    return;
  }

  // If user already cleared real input, don’t fetch
  if (!state.query.trim()) {
    suggestAbortRef.current = null;
    return;
  }

  const controller = new AbortController();
  suggestAbortRef.current = controller;

  (async () => {
    try {
      const suggestions = await knowledgeApi.getSuggestions(q, {
        signal: controller.signal,
      });

      // only apply if this controller is still current
      if (suggestAbortRef.current === controller) {
        dispatch({ type: "SET_SUGGESTIONS", suggestions });
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
    }
  })();

  return () => {
    controller.abort();
    if (suggestAbortRef.current === controller) {
      suggestAbortRef.current = null;
    }
  };
}, [debouncedQuery, state.query]);



  useEffect(() => {
  let cancelled = false;

  metaApi.listCategories().then((cats) => {
    if (!cancelled) setCategories(cats);
  });

  return () => {
    cancelled = true;
  };
}, []);

useEffect(() => {
  if (!state.selectedArticle) return;

  const isMobile = window.matchMedia("(max-width: 899px)").matches;
  if (!isMobile) return;

  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = prev;
  };
}, [state.selectedArticle]);

useEffect(() => {
  try {
    const raw = localStorage.getItem("egain_saved_ids");
    const savedIds = raw ? (JSON.parse(raw) as string[]) : [];
    dispatch({ type: "INIT_SAVED", savedIds });
  } catch {
    // ignore
  }
}, []);

useEffect(() => {
  try {
    localStorage.setItem("egain_saved_ids", JSON.stringify(state.savedIds));
  } catch {
    // ignore
  }
}, [state.savedIds]);



const executeSearch = useCallback(
  async (
    query: string,
    filters: typeof initialSearchState.filters,
    sortBy: typeof initialSearchState.sortBy
  ) =>  {
    const normalizedQuery = query.trim();
  
    // If empty, clear results + stop loading, and don't hit backend
    if (!normalizedQuery) {
      dispatch({ type: "SEARCH_SUCCESS", results: [] });
      dispatch({ type: "SELECT_ARTICLE", article: null }); 
      return;
    }
    dispatch({ type: "SELECT_ARTICLE", article: null });
    dispatch({ type: "SET_SUGGESTIONS", suggestions: [] });
    dispatch({ type: "SEARCH_START" });

    try {
      const results = await knowledgeApi.searchArticles({
        query: normalizedQuery,
        filters,
        sortBy,
      });
      dispatch({ type: "SEARCH_SUCCESS", results }); 
      dispatch({ type: "ADD_HISTORY", query: normalizedQuery });

    } catch {
      dispatch({ type: "SEARCH_ERROR", error: "Search failed" });
    }
  }, []
);


const handleQueryChange = useCallback(
  (value: string) => {
    dispatch({ type: "SET_QUERY", query: value });

    if (!value.trim()) {
      setIsSearchFocused(true);
      suggestAbortRef.current?.abort();
      suggestAbortRef.current = null;

      dispatch({ type: "RESET_OVERLAYS" });
      dispatch({ type: "CLEAR_RESULTS" });
    }
  },
  [dispatch]
);

const handleSubmit = useCallback(async() => {
    setIsSearchFocused(false);
    // dispatch({ type: "SET_SUGGESTIONS", suggestions: [] });
    // dispatch({ type: "SELECT_ARTICLE", article: null });
    dispatch({ type: "RESET_OVERLAYS" });

    await executeSearch(state.query, state.filters, state.sortBy);
  }, [dispatch, executeSearch, state.query, state.filters, state.sortBy]);

const handleSuggestionSelect = useCallback(
  async (value: string) => {
    setIsSearchFocused(false);
    dispatch({ type: "SET_QUERY", query: value });
    // dispatch({ type: "SET_SUGGESTIONS", suggestions: [] });
    // dispatch({ type: "SELECT_ARTICLE", article: null });
    dispatch( {type: "RESET_OVERLAYS"});
    await executeSearch(value, state.filters, state.sortBy);
  },
  [dispatch, executeSearch, state.filters, state.sortBy]
);

const handleHistorySelect = useCallback(
  async (q: string) => {
    setIsSearchFocused(false);
    dispatch({ type: "SET_QUERY", query: q });
    // dispatch({ type: "SET_SUGGESTIONS", suggestions: [] });
    // dispatch({ type: "SELECT_ARTICLE", article: null });
    dispatch({type: "RESET_OVERLAYS"});
    await executeSearch(q, state.filters, state.sortBy);
  },
  [dispatch, executeSearch, state.filters, state.sortBy]
);


async function applyFiltersAndSort() {
  dispatch({ type: "SELECT_ARTICLE", article: null });
  await executeSearch(state.query, state.filters, state.sortBy);
}

async function clearFilters() {
  dispatch({ type: "SELECT_ARTICLE", article: null });
  dispatch({ type: "SET_FILTERS", filters: {} });
  dispatch({ type: "SET_SORT", sortBy: "relevance" });
  await executeSearch(state.query, {}, "relevance");
}

const activeCount =
  (state.filters.category ? 1 : 0) +
  (state.filters.fromDate ? 1 : 0) +
  (state.filters.toDate ? 1 : 0) +
  (state.sortBy !== "relevance" ? 1 : 0);

const filtersActive = activeCount > 0;

const hasQuery = Boolean(state.query.trim());
const showSuggestions = isSearchFocused && hasQuery && state.suggestions.length > 0;
const showHistory = isSearchFocused && !hasQuery && state.history.length > 0;

const visibleResults =
  state.view === "saved"
    ? state.results.filter((a) => state.savedIds.includes(a.id))
    : state.results;


return (
  <>
  <main
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
    }}
  >
 <div
  className="egain-page"
  style={{
    width: "100%",
    maxWidth: 960,
    padding: "96px 24px 24px",
    paddingRight: state.selectedArticle ? 460 : 24, // desktop reserves space for panel
    transition: "padding-right 160ms ease",
  }}
>

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


      <div style={{ position: "relative", margin: "0 auto 16px", maxWidth: 640 }}>
        <SearchBar
          value={state.query}
          onChange={handleQueryChange}
          onSubmit={handleSubmit}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            setIsSearchFocused(false);
            dispatch({ type: "SET_SUGGESTIONS", suggestions: [] });
          }}
          onSpeechClick={() => {
            // placeholder: wire later to Web Speech API
            console.log("Voice search clicked");
          }}
          onImageClick={() => {
            // placeholder: open file picker / image search modal
            console.log("Image search clicked");
          }}

        />

{showSuggestions ? (
  <SuggestionsList
    suggestions={state.suggestions}
    onSelect={handleSuggestionSelect}
  />
) : showHistory ? (
  <SearchHistory
    items={state.history}
    onSelect={handleHistorySelect}
    onClear={() => dispatch({ type: "CLEAR_HISTORY" })}
  />
) : null}

      </div>
<FilterPanel
  title="Filters"
  isActive={filtersActive}
  activeCount={activeCount}
>
  <FiltersBar
    filters={state.filters}
    sortBy={state.sortBy}
    categories={categories}
    onChangeFilters={(filters) => dispatch({ type: "SET_FILTERS", filters })}
    onChangeSort={(sortBy) => dispatch({ type: "SET_SORT", sortBy })}
    onApply={applyFiltersAndSort}
    onClear={clearFilters}
  />
</FilterPanel>

<div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "12px 0" }}>
  <button
    type="button"
    onClick={() => dispatch({ type: "SET_VIEW", view: "all" })}
    style={{
      padding: "8px 12px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      background: state.view === "all" ? "#111827" : "#fff",
      color: state.view === "all" ? "#fff" : "#111827",
      cursor: "pointer",
      fontSize: 13,
    }}
  >
    All results
  </button>

  <button
    type="button"
    onClick={() => dispatch({ type: "SET_VIEW", view: "saved" })}
    style={{
      padding: "8px 12px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      background: state.view === "saved" ? "#111827" : "#fff",
      color: state.view === "saved" ? "#fff" : "#111827",
      cursor: "pointer",
      fontSize: 13,
    }}
  >
    Saved ({state.savedIds.length})
  </button>
</div>



{state.view === "saved" && !state.loading && visibleResults.length === 0 && (
  <div style={{ textAlign: "center", color: "#6b7280", fontSize: 14, margin: "18px 0" }}>
    No saved articles in the current results.
    <div style={{ marginTop: 6, fontSize: 13 }}>
      Tip: search first, then click <b>Save</b> on articles you want to keep.
    </div>
  </div>
)}


        <ResultsList
          results={visibleResults}
          loading={state.loading}
          onSelect={(article) => {
            setIsSearchFocused(false); 
            dispatch({
              type: "SELECT_ARTICLE",
              article,
            })
          }}
        />
      </div>
      <style>{`
  @media (max-width: 899px) {
    .egain-page {
      padding-right: 24px !important; /* mobile should NOT reserve space */
    }
  }
`}</style>

    </main>

 <ArticleDetailPanel
  article={state.selectedArticle}
  isSaved={!!state.selectedArticle && state.savedIds.includes(state.selectedArticle.id)}
  onToggleSave={(id) => dispatch({ type: "TOGGLE_SAVED", id })}
  onClose={() => dispatch({ type: "SELECT_ARTICLE", article: null })}
/>


  </>
);

}
