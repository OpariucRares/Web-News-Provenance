import React, { useEffect, useState, useCallback } from "react";
import ArticleCard from "../components/ArticleCard";
import Pagination from "react-bootstrap/Pagination";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getFilteredArticleCards } from "../api/sparqlApi";
import { Filters } from "../interfaces/Filters";
import { ArticleCard as ArticleCardType } from "../interfaces/ArticleCard";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const AdvancedSearchPage = () => {
  const [articles, setArticles] = useState<ArticleCardType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [language, setLanguage] = useState<string>("en");
  const [subject, setSubject] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "tr", name: "Turkish" },
    { code: "it", name: "Italian" },
    { code: "af", name: "Afrikaans" },
    { code: "da", name: "Danish" },
    { code: "ca", name: "Catalan" },
    { code: "pt", name: "Portuguese" },
    { code: "lt", name: "Lithuanian" },
    { code: "sl", name: "Slovenian" },
  ];

  const subjectOptions = [
    { value: "", label: "All Categories" },
    { value: "Economy", label: "Economy" },
    { value: "Technology", label: "Technology" },
    { value: "Sports", label: "Sports" },
    { value: "Politics", label: "Politics" },
    { value: "Health", label: "Health" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Education", label: "Education" },
    { value: "Environment", label: "Environment" },
    { value: "Culture", label: "Culture" },
    { value: "Travel", label: "Travel" },
    { value: "Other", label: "Other" },
  ];

  const fetchArticles = useCallback(
    async (page: number) => {
      setLoading(true);

      const offset = (page - 1) * 9;

      const filters: Filters = {
        language: language || undefined,
        subject: subject || undefined,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        search: searchQuery || undefined,
        authorName: authorName || undefined,
      };

      const result = await getFilteredArticleCards(offset, filters);

      if (typeof result === "string") {
        setError(result);
        setHasMore(false);
      } else {
        setArticles(result);
        setError(null);
        setHasMore(result.length > 0);
      }

      setLoading(false);
      window.scrollTo(0, 0);
    },
    [language, subject, startDate, endDate, searchQuery, authorName]
  );

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const handlePrevPage = () => {
    if (page > 1) {
      fetchArticles(page - 1);
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      fetchArticles(page + 1);
      setPage(page + 1);
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    fetchArticles(pageNumber);
    setPage(pageNumber);
  };

  const handleApplyFilters = () => {
    fetchArticles(1);
    setPage(1);
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

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="row mt-4">
        <div className="col-md-3">
          <div
            className="p-4"
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <h5>Filters</h5>
            <form>
              <div className="mb-3">
                <TextField
                  select
                  label="Language"
                  value={language}
                  fullWidth
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="mb-3">
                <TextField
                  select
                  label="Category"
                  value={subject}
                  fullWidth
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {subjectOptions.map((subj) => (
                    <MenuItem key={subj.value} value={subj.value}>
                      {subj.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="mb-3">
                <TextField
                  label="Author Name"
                  value={authorName}
                  fullWidth
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="mb-3">
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="dd/MM/yyyy"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </div>
                <div className="mb-3">
                  <DesktopDatePicker
                    label="End Date"
                    inputFormat="dd/MM/yyyy"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </div>
              </LocalizationProvider>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleApplyFilters}
                style={{
                  marginTop: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                Apply Filters
              </Button>
            </form>
          </div>
        </div>
        <div className="col-md-9">
          <div className="row">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && articles.length === 0 && (
              <div>No results found</div>
            )}
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {articles.length > 0 && (
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
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
