import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ArticleCard from "../components/ArticleCard";
import { fetchArticles } from "../api/sparqlApi";

const AdvancedSearchPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

  return (
    <div className="container mt-4">
      <SearchBar />
      <div className="row mt-4">
        <div className="col-md-3">
          <h5>Filters</h5>
          <form>
            <div className="mb-3">
              <label className="form-label">Keyword</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search keyword..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select">
                <option value="all">All</option>
                <option value="news">News</option>
                <option value="opinion">Opinion</option>
              </select>
            </div>
            <button type="button" className="btn btn-secondary w-100">
              Apply Filters
            </button>
          </form>
        </div>
        <div className="col-md-9">
          {/* <div className="row">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
