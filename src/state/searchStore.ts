import type { Article } from "../types/article";
import type { SearchFilters, SortBy } from "../types/search";

/**
 * Search State
 */
export type SearchState = {
  query: string;
  suggestions: string[];
  filters: SearchFilters;
  sortBy: SortBy;
  results: Article[];
  selectedArticle: Article | null;
  loading: boolean;
  error: string | null;
  history: string[];
  savedIds: string[];
  view: "all" | "saved";

};

/**
 * Initial State
 */
export const initialSearchState: SearchState = {
  query: "",
  suggestions: [],
  filters: {},
  sortBy: "relevance",
  results: [],
  selectedArticle: null,
  loading: false,
  error: null,
  history: [],

   savedIds: [],
   view: "all",
};

/**
 * Actions
 */
export type SearchAction =
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_SUGGESTIONS"; suggestions: string[] }
  | { type: "SET_FILTERS"; filters: SearchFilters }
  | { type: "SET_SORT"; sortBy: SortBy }
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; results: Article[] }
  | { type: "SEARCH_ERROR"; error: string }
  | { type: "SELECT_ARTICLE"; article: Article | null }
  | { type: "ADD_HISTORY"; query: string }
  | { type: "CLEAR_HISTORY" }
  | { type: "CLEAR_RESULTS" }
  | { type: "RESET_OVERLAYS"}
  | { type: "INIT_SAVED"; savedIds: string[] }
  | { type: "TOGGLE_SAVED"; id: string }
  | { type: "SET_VIEW"; view: "all" | "saved" };


/**
 * Reducer
 */
export function searchReducer(
  state: SearchState,
  action: SearchAction
): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.query, error: null};

    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.suggestions };

    case "SET_FILTERS":
      return { ...state, filters: action.filters };

    case "SET_SORT":
      return { ...state, sortBy: action.sortBy };

    case "SEARCH_START":
      return { ...state, loading: true, error: null, selectedArticle: null };

    case "SEARCH_SUCCESS":
      return {
        ...state,
        loading: false,
        results: action.results,
      };

    case "SEARCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case "SELECT_ARTICLE":
      return { ...state, selectedArticle: action.article };

    case "ADD_HISTORY": {
      const q = action.query.trim();
      if (!q) return state;

      const deduped = state.history.filter(
        (h) => h.toLowerCase() !== q.toLowerCase()
      );

      return { ...state, history: [q, ...deduped].slice(0, 5) };
    }

    case "CLEAR_HISTORY":
      return { ...state, history: [] };

    case "CLEAR_RESULTS":
      return {
        ...state,
        results: [],
        selectedArticle: null,
        loading: false,
        error: null,
      };

    case "RESET_OVERLAYS":
      return {
        ...state,
        suggestions: [],
        selectedArticle: null,
        error: null,
      };
    
    case "INIT_SAVED": {
      return { ...state, savedIds: action.savedIds ?? [] }; 
    }

    case "TOGGLE_SAVED": {
      const exists = state.savedIds.includes(action.id);
      const savedIds = exists
        ? state.savedIds.filter((x) => x !== action.id)
        : [action.id, ...state.savedIds];

      return { ...state, savedIds };
    }

    case "SET_VIEW":
      return { ...state, view: action.view };

    default:
      return state;
  }
}
