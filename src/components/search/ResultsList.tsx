import type { Article } from "../../types/article";
import ArticleCard from "./ArticleCard";

type Props = {
  results: Article[];
  loading: boolean;
  onSelect: (article: Article) => void;
};

export default function ResultsList({ results, loading, onSelect }: Props) {
  if (loading) {
    return <p className="mt-6 text-sm text-gray-500">Searching…</p>;
  }

  if (!loading && results.length === 0) {
    return (
      <p className="mt-6 text-sm text-gray-500">
        No results found. Try a different query.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {results.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
