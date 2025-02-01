import { useEffect, useState } from "react";
import PieChartComponent from "../components/PieChartComponent";
import {
  getListOfLanguages,
  getArticleCountByLanguage,
  getListOfCategories,
  getArticleCountByCategory,
} from "../api/statisticsApi";
import LineChartComponent from "../components/LineChartComponent";
import { prepareData } from "../utils/prepareData";

const dateList = [
  "2023-04-15T00:00:00Z",
  "2022-10-10T00:00:00Z",
  "2022-08-05T00:00:00Z",
  "2022-06-21T00:00:00Z",
  "2022-04-13T00:00:00Z",
  "2022-03-08T00:00:00Z",
  "2022-02-01T00:00:00Z",
  "2021-12-22T00:00:00Z",
  "2021-03-08T00:00:00Z",
  "2021-01-01T00:00:00Z",
  "2020-12-01T00:00:00Z",
  "2020-11-26T00:00:00Z",
  "2020-11-09T00:00:00Z",
  "2020-10-28T00:00:00Z",
  "2020-10-27T00:00:00Z",
  "2020-09-29T00:00:00Z",
  "2020-09-08T00:00:00Z",
  "2020-07-23T00:00:00Z",
  "2020-06-30T00:00:00Z",
  "2020-03-31T00:00:00Z",
  "2020-01-01T00:00:00Z",
  "2019-11-27T00:00:00Z",
  "2019-09-25T00:00:00Z",
  "2019-09-10T00:00:00Z",
  "2019-08-29T00:00:00Z",
  "2019-05-03T00:00:00Z",
  "2019-04-10T00:00:00Z",
  "2019-01-23T00:00:00Z",
  "2018-07-03T00:00:00Z",
  "2018-06-01T00:00:00Z",
  "2018-05-22T00:00:00Z",
  "2018-01-01T00:00:00Z",
  "2017-08-09T00:00:00Z",
  "2017-08-01T00:00:00Z",
  "2017-03-13T00:00:00Z",
  "2017-03-07T00:00:00Z",
  "2017-01-17T00:00:00Z",
  "2017-01-15T00:00:00Z",
  "2017-01-01T00:00:00Z",
  "2016-06-30T00:00:00Z",
  "2016-04-08T00:00:00Z",
  "2016-03-30T00:00:00Z",
  "2016-02-11T00:00:00Z",
  "2015-06-23T00:00:00Z",
  "2015-01-01T00:00:00Z",
  "2014-10-22T00:00:00Z",
  "2014-08-29T00:00:00Z",
  "2014-07-27T00:00:00Z",
  "2014-05-07T00:00:00Z",
  "2014-03-04T00:00:00Z",
  "2014-01-01T00:00:00Z",
  "2013-12-02T00:00:00Z",
  "2013-05-01T00:00:00Z",
  "2013-01-01T00:00:00Z",
  "2012-12-15T00:00:00Z",
  "2012-04-19T00:00:00Z",
  "2012-01-09T00:00:00Z",
  "2012-01-01T00:00:00Z",
  "2011-09-16T00:00:00Z",
  "2011-03-23T00:00:00Z",
  "2010-12-15T00:00:00Z",
  "2010-05-21T00:00:00Z",
  "1970-08-15T00:00:00Z",
  "1952-08-14T00:00:00Z",
  "1948-07-01T00:00:00Z",
  "1915-02-01T00:00:00Z",
  "1911-06-01T00:00:00Z",
  "1853-01-01T00:00:00Z",
];

const StatisticsPage: React.FC = () => {
  const [dataLanguages, setdataLanguages] = useState<
    { name: string; value: number }[]
  >([]);
  const [dataCategories, setdataCategories] = useState<
    { name: string; value: number }[]
  >([]);
  const [data, setData] = useState<{ year: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguageData = async () => {
      try {
        const languages = await getListOfLanguages();
        if (Array.isArray(languages)) {
          const countsPromises = languages.map(async (language) => {
            const count = await getArticleCountByLanguage(language);
            return { name: language, value: Number(count) };
          });
          const counts = await Promise.all(countsPromises);
          setdataLanguages(counts);
        } else {
          setError(languages);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategoryData = async () => {
      try {
        const categories = await getListOfCategories();
        if (Array.isArray(categories)) {
          const countsPromises = categories.map(async (category) => {
            const count = await getArticleCountByCategory(category);
            return { name: category, value: Number(count) };
          });
          const counts = await Promise.all(countsPromises);
          setdataCategories(counts);
        } else {
          setError(categories);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageData();
    fetchCategoryData();
    const preparedData = prepareData(dateList);
    setData(preparedData);
  }, []);

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Article Count by Language</h2>
      <div className="mt-4">
        <PieChartComponent data={dataLanguages} />
      </div>
      <h2>Article Count by Category</h2>
      <div className="mt-4">
        <PieChartComponent data={dataCategories} />
      </div>
      <h2>Date Evolution Over Time</h2>
      <div className="mt-4">
        <LineChartComponent data={data} />
      </div>
    </div>
  );
};

export default StatisticsPage;
