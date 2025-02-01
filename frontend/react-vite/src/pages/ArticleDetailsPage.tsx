import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleById } from "../api/sparqlApi";
import { Article as ArticleType } from "../interfaces/Article";

const cleanString = (str: string) => str.split("^^")[0];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getLanguageName = (languageCode: string) => {
  const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    tr: "Turkish",
    it: "Italian",
    af: "Afrikaans",
    da: "Danish",
    ca: "Catalan",
    pt: "Portuguese",
    lt: "Lithuanian",
    sl: "Slovenian",
  };

  return languageMap[languageCode] || languageCode;
};

const extractLastPart = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

const ArticleDetailsPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        const result = await getArticleById(articleId);
        if (typeof result === "string") {
          setError(result);
        } else {
          setArticle(result);
          setError(null);
        }
      }
    };

    fetchArticle();
  }, [articleId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4 mb-3">
          <img
            src={article.image}
            alt={cleanString(article.headline)}
            className="img-fluid rounded"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>
        <div className="col-md-8">
          <h1>{cleanString(article.headline)}</h1>
          <table className="table">
            <tbody>
              <tr>
                <th scope="row">Creator</th>
                <td>
                  <a
                    href={article.creator}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.creatorName || "View Creator"}
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Author</th>
                <td>
                  <a
                    href={article.author}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cleanString(article.authorName)}
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Date</th>
                <td>{formatDate(cleanString(article.date))}</td>
              </tr>
              <tr>
                <th scope="row">Language</th>
                <td>{getLanguageName(cleanString(article.language))}</td>
              </tr>
              <tr>
                <th scope="row">Description</th>
                <td>{cleanString(article.description)}</td>
              </tr>
              <tr>
                <th scope="row">Category</th>
                <td>{extractLastPart(cleanString(article.subject))}</td>{" "}
              </tr>
              <tr>
                <th scope="row">URL</th>
                <td>
                  <a
                    href={article.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Article
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Article Content</th>
                <td>
                  <a
                    href={article.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    article content
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Wikidata URL</th>
                <td>
                  <a
                    href={article.wikidataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Wikidata Entry
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <iframe
            src={article.contentUrl}
            title="Embedded PDF"
            width="100%"
            height="600px"
            style={{ border: "none" }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsPage;
