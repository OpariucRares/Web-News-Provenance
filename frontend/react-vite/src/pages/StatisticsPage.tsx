import { useEffect, useState } from "react";
import PieChartComponent from "../components/PieChartComponent";
import {
  getListOfLanguages,
  getArticleCountByLanguage,
  getListOfCategories,
  getArticleCountByCategory,
  getDateArticlesBasedLanguage,
  getDateArticlesBasedCategory,
} from "../api/statisticsApi";
import LineChartComponent from "../components/LineChartComponent";
import { prepareData } from "../utils/prepareDataArticles";

const StatisticsPage: React.FC = () => {
  const [dataLanguages, setDataLanguages] = useState<
    { name: string; value: number }[]
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

  useEffect(() => {
    const fetchLanguageData = async () => {
      const cachedData = localStorage.getItem("dataLanguages");
      if (cachedData) {
        setDataLanguages(JSON.parse(cachedData));
        setLoadingLanguages(false);
      } else {
        try {
          const languages = await getListOfLanguages();
          if (Array.isArray(languages)) {
            const countsPromises = languages.map(async (language) => {
              const count = await getArticleCountByLanguage(language);
              return { name: language, value: Number(count) };
            });
            const counts = await Promise.all(countsPromises);
            setDataLanguages(counts);
            localStorage.setItem("dataLanguages", JSON.stringify(counts));
          } else {
            setError(languages);
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoadingLanguages(false);
        }
      }
    };

    fetchLanguageData();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
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
        } catch (error) {
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
      try {
        const response = await getDateArticlesBasedLanguage(selectedLanguage);
        if (typeof response === "string") {
          // Handle the case when the response is an error message
          throw new Error(response);
        } else {
          // The response is the list of dates
          const data = prepareData(response);
          setDateArticleLanguage(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingDateArticleLanguage(false);
      }
    };

    fetchDataArticleByLanguage();
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchDataArticleByCategory = async () => {
      try {
        const response = await getDateArticlesBasedCategory(selectedCategory);
        if (typeof response === "string") {
          // Handle the case when the response is an error message
          throw new Error(response);
        } else {
          // The response is the list of dates
          const data = prepareData(response);
          setDateArticleCategory(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingDateArticleCategory(false);
      }
    };

    fetchDataArticleByCategory();
  }, [selectedCategory]);

  if (error) {
    return <div className="container mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-4" vocab="http://schema.org/" typeof="WebPage">
      <h2 property="name">Article Count by Language</h2>
      <div className="mt-4" property="mainContentOfPage">
        {loadingLanguages ? (
          <div>Loading...</div>
        ) : (
          <PieChartComponent data={dataLanguages} title="Languages" />
        )}
      </div>
      <h2 property="name">Date Evolution Over Time By Language</h2>
      <div className="row mb-4" property="mainContentOfPage">
        {dataLanguages.map((language) => (
          <div
            key={language.name}
            className="col-4 col-sm-3 col-md-2 mb-2"
            vocab="http://schema.org/"
            typeof="Language"
          >
            <button
              type="button"
              className={`btn btn-outline-primary w-100 ${
                selectedLanguage === language.name ? "active" : ""
              }`}
              onClick={() => setSelectedLanguage(language.name)}
            >
              <span property="name">{language.name}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4" property="mainContentOfPage">
        {loadingDateArticleLanguage ? (
          <div>Loading...</div>
        ) : (
          <LineChartComponent data={dateArticleLanguage} />
        )}
      </div>
      <h2 property="name">Article Count by Category</h2>
      <div className="mt-4" property="mainContentOfPage">
        {loadingCategories ? (
          <div>Loading...</div>
        ) : (
          <PieChartComponent data={dataCategories} title="Categories" />
        )}
      </div>
      <h2 property="name">Date Evolution Over Time By Category</h2>
      <div className="row mb-4" property="mainContentOfPage">
        {dataCategories.map((category) => (
          <div
            key={category.name}
            className="col-4 col-sm-3 col-md-2 mb-2"
            vocab="http://schema.org/"
            typeof="Thing"
          >
            <button
              type="button"
              className={`btn btn-outline-primary w-100 ${
                selectedCategory === category.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span property="name">{category.name}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4" property="mainContentOfPage">
        {loadingDateArticleCategory ? (
          <div>Loading...</div>
        ) : (
          <LineChartComponent data={dateArticleCategory} />
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
