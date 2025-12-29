import { backend } from "../backend-pseudocode";

/**
 * Simulated network latency helper
 */
function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    let done = false;

    const onAbort = () => {
      if (done) return;
      done = true;
      clearTimeout(t);
      signal?.removeEventListener("abort", onAbort);
      reject(new DOMException("Aborted", "AbortError"));
    };

    const t = setTimeout(() => {
      if (done) return;
      done = true;
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}



/**
 * API Client Transport
 * --------------------
 * - Today: routes calls to in-memory pseudo backend (no server required).
 * - Future: replace implementation with fetch()/axios to real endpoints.
 *
 * IMPORTANT:
 * UI code must ONLY call api/* files, never backend/* directly.
 */
export const apiClient = {
  async suggest(prefix: string, opts?: { signal?: AbortSignal }): Promise<string[]> {
  await sleep(150, opts?.signal); // simulate network (cancellable)
  if (opts?.signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return backend.suggest(prefix);
},


async search(
  args: {
    query: string;
    filters: {
      category?: string;
      fromDate?: string;
      toDate?: string;
    };
    sortBy: "relevance" | "date" | "popularity";
  },
  opts?: { signal?: AbortSignal }
) {
  await sleep(350, opts?.signal);
  if (opts?.signal?.aborted) throw new DOMException("Aborted", "AbortError");
   return backend.search({ ...args});

},


  async getArticleById(id: string) {
    await sleep(150);
    const article = backend.getArticleById(id);
    if (!article) {
      throw new Error("Article not found");
    }
    return article;
  },
};
