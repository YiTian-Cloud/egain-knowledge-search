import type { Article } from "../../types/article";

type Props = {
  article: Article;
  onSelect: (article: Article) => void;
};

export default function ArticleCard({ article, onSelect }: Props) {
  return (
    <div
      className="cursor-pointer rounded border p-4 hover:bg-gray-50"
      onClick={() => onSelect(article)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium">{article.title}</h3>
        <span className="text-xs text-gray-500">
          {Math.round(article.relevanceScore * 100)}%
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {article.content}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded bg-gray-100 px-2 py-1 text-xs">
          {article.category}
        </span>
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
