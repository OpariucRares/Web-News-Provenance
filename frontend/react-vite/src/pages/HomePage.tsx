// HomePage.tsx
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ArticleCard from "../components/ArticleCard";
import { getAllArticleCardsPagination } from "../api/sparqlApi";
import { ArticleCard as ArticleCardType } from "../interfaces/ArticleCard";

const HomePage = () => {
  const [articleCards, setArticleCards] = useState<ArticleCardType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleCards = async () => {
      const result = await getAllArticleCardsPagination(0);
      if (typeof result === "string") {
        setError(result);
      } else {
        setArticleCards(result);
        setError(null);
      }
    };

    fetchArticleCards();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <SearchBar />
      <div className="row">
        {articleCards.map((articleCard) => (
          <ArticleCard key={articleCard.id} article={articleCard} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
