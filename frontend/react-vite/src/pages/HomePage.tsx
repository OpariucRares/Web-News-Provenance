// HomePage.tsx
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ArticleCard from "../components/ArticleCard";
import { fetchArticles } from "../api/articlesApi";

const HomePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

  return (
    <div className="container mt-4">
      <SearchBar />
      <div className="row">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
