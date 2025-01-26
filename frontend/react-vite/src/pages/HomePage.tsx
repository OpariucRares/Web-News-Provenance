import SearchBar from "../components/SearchBar";
import ArticleCard from "../components/ArticleCard";
import articles from "../data/articles.json";

const HomePage = () => (
  <div className="container mt-4">
    <SearchBar />
    <div className="row">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  </div>
);

export default HomePage;
