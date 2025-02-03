import { useEffect, useState } from "react";
import PieChartComponent from "../components/PieChartComponent";
import LineChartComponent from "../components/LineChartComponent";
import {
  getListOfLanguages,
  getArticleCountByLanguage,
  getListOfCategories,
  getArticleCountByCategory,
  getDateArticlesBasedLanguage,
  getDateArticlesBasedCategory,
} from "../api/statisticsApi";
import { prepareData } from "../utils/prepareDataArticles";
import * as htmlToImage from "html-to-image";

const StatisticsPage: React.FC = () => {
  const [dataLanguages, setDataLanguages] = useState<
    { code: string; name: string; value: number }[]
  >([]);
  const [dataCategories, setDataCategories] = useState<
    { name: string; value: number }[]
  >([]);
  const [dateArticleLanguage, setDateArticleLanguage] = useState<
    { year: number; count: number }[]
  >([]);
  const [dateArticleCategory, setDateArticleCategory] = useState<
    { year: number; count: number }[]
  >([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDateArticleLanguage, setLoadingDateArticleLanguage] =
    useState(true);
  const [loadingDateArticleCategory, setLoadingDateArticleCategory] =
    useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("Education");

  const languageMap: { [key: string]: string } = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    tr: "Turkish",
    it: "Italian",
    af: "Afrikaans",
    pl: "Polish",
    pt: "Portuguese",
    da: "Danish",
  };

  useEffect(() => {
    const fetchLanguageData = async () => {
      setLoadingLanguages(true);
      localStorage.removeItem("dataLanguages");
      try {
        const languages = await getListOfLanguages();
        if (Array.isArray(languages)) {
          const countsPromises = languages.map(async (languageCode) => {
            const count = await getArticleCountByLanguage(languageCode);
            const fullName =
              languageMap[languageCode] || languageCode.toUpperCase();

            return {
              code: languageCode,
              name: fullName,
              value: Number(count),
            };
          });
          const counts = await Promise.all(countsPromises);
          setDataLanguages(counts);
          localStorage.setItem("dataLanguages", JSON.stringify(counts));
        } else {
          setError(languages);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoadingLanguages(false);
      }
    };

    fetchLanguageData();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoadingCategories(true);
      const cachedData = localStorage.getItem("dataCategories");
      if (cachedData) {
        setDataCategories(JSON.parse(cachedData));
        setLoadingCategories(false);
      } else {
        try {
          const categories = await getListOfCategories();
          if (Array.isArray(categories)) {
            const countsPromises = categories.map(async (category) => {
              const count = await getArticleCountByCategory(category);
              return { name: category, value: Number(count) };
            });
            const counts = await Promise.all(countsPromises);
            setDataCategories(counts);
            localStorage.setItem("dataCategories", JSON.stringify(counts));
          } else {
            setError(categories);
          }
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategoryData();
  }, []);

  useEffect(() => {
    const fetchDataArticleByLanguage = async () => {
      setLoadingDateArticleLanguage(true);
      try {
        const response = await getDateArticlesBasedLanguage(selectedLanguage);
        if (typeof response === "string") {
          throw new Error(response);
        } else {
          const data = prepareData(response);
          setDateArticleLanguage(data);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoadingDateArticleLanguage(false);
      }
    };

    fetchDataArticleByLanguage();
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchDataArticleByCategory = async () => {
      setLoadingDateArticleCategory(true);
      try {
        const response = await getDateArticlesBasedCategory(selectedCategory);
        if (typeof response === "string") {
          throw new Error(response);
        } else {
          const data = prepareData(response);
          setDateArticleCategory(data);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoadingDateArticleCategory(false);
      }
    };

    fetchDataArticleByCategory();
  }, [selectedCategory]);

  const handleDownloadChart = async (chartId: string, format: string) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;

    try {
      let dataUrl = "";
      if (format === "png") {
        dataUrl = await htmlToImage.toPng(chartElement);
      } else if (format === "svg") {
        dataUrl = await htmlToImage.toSvg(chartElement);
      }
      const link = document.createElement("a");
      link.download = `${chartId}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error exporting chart:", error);
    }
  };

  if (error) {
    return <div className="container mt-4">Error: {error}</div>;
  }

  return (
    <div
      className="container mt-4"
      vocab="http://schema.org/"
      typeof="WebPage"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 property="name" className="mt-4">
        Article Count by Language
      </h2>
      <hr />
      <div
        className="chart-container"
        property="mainContentOfPage"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "40px",
        }}
      >
        {loadingLanguages ? (
          <div>Loading...</div>
        ) : (
          <>
            <PieChartComponent
              data={dataLanguages}
              title="Languages"
              dataKey="value"
              nameKey="name"
              chartId="languagePieChart"
            />
            <div
              className="d-flex"
              style={{ marginTop: "20px", flexWrap: "wrap" }}
            >
              <button
                className="btn btn-outline-primary me-2 mb-2"
                onClick={() => handleDownloadChart("languagePieChart", "png")}
              >
                Download PNG
              </button>
              <button
                className="btn btn-outline-primary mb-2"
                onClick={() => handleDownloadChart("languagePieChart", "svg")}
              >
                Download SVG
              </button>
            </div>
          </>
        )}
      </div>

      <h2 property="name" className="mt-5">
        Date Evolution Over Time By Language
      </h2>
      <hr />
      <div className="mb-3" property="mainContentOfPage">
        <div
          className="d-flex align-items-center"
          style={{ marginBottom: "20px" }}
        >
          <label
            htmlFor="languageSelect"
            style={{ marginRight: "10px", fontWeight: "bold" }}
          >
            Select Language:
          </label>
          <select
            id="languageSelect"
            className="form-select w-auto"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {dataLanguages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
        {!loadingDateArticleLanguage && (
          <div
            className="d-flex"
            style={{ marginBottom: "20px", flexWrap: "wrap" }}
          >
            <button
              className="btn btn-outline-primary me-2 mb-2"
              onClick={() => handleDownloadChart("languageLineChart", "png")}
            >
              Download PNG
            </button>
            <button
              className="btn btn-outline-primary mb-2"
              onClick={() => handleDownloadChart("languageLineChart", "svg")}
            >
              Download SVG
            </button>
          </div>
        )}
        <div
          id="languageLineChart"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loadingDateArticleLanguage ? (
            <div>Loading...</div>
          ) : (
            <LineChartComponent data={dateArticleLanguage} />
          )}
        </div>
      </div>

      <h2 property="name" className="mt-5">
        Article Count by Category
      </h2>
      <hr />
      <div
        className="chart-container"
        property="mainContentOfPage"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "40px",
        }}
      >
        {loadingCategories ? (
          <div>Loading...</div>
        ) : (
          <>
            <PieChartComponent
              data={dataCategories}
              title="Categories"
              dataKey="value"
              nameKey="name"
              chartId="categoryPieChart"
            />
            <div
              className="d-flex"
              style={{ marginTop: "20px", flexWrap: "wrap" }}
            >
              <button
                className="btn btn-outline-primary me-2 mb-2"
                onClick={() => handleDownloadChart("categoryPieChart", "png")}
              >
                Download PNG
              </button>
              <button
                className="btn btn-outline-primary mb-2"
                onClick={() => handleDownloadChart("categoryPieChart", "svg")}
              >
                Download SVG
              </button>
            </div>
          </>
        )}
      </div>

      <h2 property="name" className="mt-5">
        Date Evolution Over Time By Category
      </h2>
      <hr />
      <div className="mb-3" property="mainContentOfPage">
        <div
          className="d-flex align-items-center"
          style={{ marginBottom: "20px" }}
        >
          <label
            htmlFor="categorySelect"
            style={{ marginRight: "10px", fontWeight: "bold" }}
          >
            Select Category:
          </label>
          <select
            id="categorySelect"
            className="form-select w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {dataCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {!loadingDateArticleCategory && (
          <div
            className="d-flex"
            style={{ marginBottom: "20px", flexWrap: "wrap" }}
          >
            <button
              className="btn btn-outline-primary me-2 mb-2"
              onClick={() => handleDownloadChart("categoryLineChart", "png")}
            >
              Download PNG
            </button>
            <button
              className="btn btn-outline-primary mb-2"
              onClick={() => handleDownloadChart("categoryLineChart", "svg")}
            >
              Download SVG
            </button>
          </div>
        )}
        <div
          id="categoryLineChart"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loadingDateArticleCategory ? (
            <div>Loading...</div>
          ) : (
            <LineChartComponent data={dateArticleCategory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
