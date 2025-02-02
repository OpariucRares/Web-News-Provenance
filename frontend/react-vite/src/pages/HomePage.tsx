import { useEffect, useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import ArticleCard from "../components/ArticleCard";
import {
  getAllArticleCardsPagination,
  searchArticleCards,
} from "../api/sparqlApi";
import { ArticleCard as ArticleCardType } from "../interfaces/ArticleCard";
import Pagination from "react-bootstrap/Pagination";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const HomePage: React.FC = () => {
  const [articleCards, setArticleCards] = useState<ArticleCardType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchArticleCards = useCallback(
    async (page: number, search: string) => {
      setLoading(true);
      let result;
      if (search) {
        result = await searchArticleCards(search, page - 1); // API expects 0-based page
      } else {
        result = await getAllArticleCardsPagination(page - 1);
      }
      if (typeof result === "string") {
        setError(result);
        setHasMore(false);
      } else {
        setArticleCards(result);
        setError(null);
        if (result.length === 0) {
          setHasMore(false);
        }
      }
      setLoading(false);
      window.scrollTo(0, 0);
    },
    []
  );

  useEffect(() => {
    fetchArticleCards(page, searchQuery);
  }, [fetchArticleCards, page, searchQuery]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to the first page on new search
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxItemsToShow = 5;
    const startPage = Math.max(1, page - 2);

    for (
      let number = startPage;
      number < startPage + maxItemsToShow;
      number++
    ) {
      if (number > 0) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === page}
            onClick={() => handlePageSelect(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
    }

    return items;
  };

  if (error) {
    return (
      <div className="container mt-4">
        <div vocab="http://schema.org/" typeof="Error">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mt-4"
      vocab="http://schema.org/"
      typeof="WebPage"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <h1 property="name">Home Page</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="row" property="mainContentOfPage">
        {articleCards.length > 0
          ? articleCards.map((articleCard) => (
              <ArticleCard key={articleCard.id} article={articleCard} />
            ))
          : !loading && <div>No results found</div>}
      </div>
      {loading && <div>Loading...</div>}

      {articleCards.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Button
              onClick={handlePrevPage}
              disabled={page <= 1}
              style={{
                backgroundColor: page <= 1 ? "#ccc" : "#007bff",
                color: "#fff",
                margin: "0 5px",
                borderRadius: "50%",
                padding: "5px 10px",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowBackIcon />
            </Button>
            {renderPaginationItems()}
            <Button
              onClick={handleNextPage}
              disabled={!hasMore}
              style={{
                backgroundColor: !hasMore ? "#ccc" : "#007bff",
                color: "#fff",
                margin: "0 5px",
                borderRadius: "50%",
                padding: "5px 10px",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowForwardIcon />
            </Button>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default HomePage;
