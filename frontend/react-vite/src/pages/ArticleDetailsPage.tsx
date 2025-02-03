import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleById, getRecommendedArticles } from "../api/sparqlApi";
import { Article as ArticleType } from "../interfaces/Article";
import { ArticleCard as ArticleCardType } from "../interfaces/ArticleCard";
import placeholderImage from "../assets/placeholder-image.jpg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ArticleCardRecommendation from "../components/ArticleCardRecommendation";

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
    pl: "Polish",
    pt: "Portuguese",
    da: "Danish",
  };
  return languageMap[languageCode as keyof typeof languageMap] || languageCode;
};
const extractLastPart = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

const ArticleDetailsPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendedArticles, setRecommendedArticles] = useState<
    ArticleCardType[]
  >([]);

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

  useEffect(() => {
    const fetchRecommendedArticles = async () => {
      if (article?.subject) {
        const category = extractLastPart(cleanString(article.subject));
        let result = await getRecommendedArticles(category);

        if (typeof result === "string") {
          setError(result);
          return;
        }
        result = result.filter((a) => a.id !== article.id);

        if (result.length === 0) {
          const fallbackResult = await getRecommendedArticles("Other");
          if (typeof fallbackResult === "string") {
            setError(fallbackResult);
          } else {
            setRecommendedArticles(
              fallbackResult.filter((a) => a.id !== article.id)
            );
          }
        } else {
          setRecommendedArticles(result);
        }
      }
    };

    if (article) {
      fetchRecommendedArticles();
    }
  }, [article]);
  const getImageUrl = (url: string) => {
    const acceptedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
    ];
    const hasValidExtension = acceptedExtensions.some((extension) =>
      url.toLowerCase().endsWith(extension)
    );

    if (!hasValidExtension) {
      return placeholderImage;
    }
    return url;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  const imageUrl = getImageUrl(article.image);

  return (
    <div
      className="container mt-4"
      style={{ backgroundColor: "#f8f9fa", padding: "20px" }}
      prefix="schema: https://schema.org"
      typeof="schema:Article"
    >
      <div className="row">
        <div className="col-md-4 mb-3">
          <img
            src={imageUrl}
            alt={cleanString(article.headline)}
            className="img-fluid rounded"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
            property="schema:image"
          />
        </div>
        <div className="col-md-8">
          <h1 property="schema:headline">{cleanString(article.headline)}</h1>
          <table className="table">
            <tbody>
              <tr>
                <th scope="row">Creator</th>
                <td>
                  <a
                    href={article.creator}
                    target="_blank"
                    rel="noopener noreferrer"
                    property="schema:creator"
                    typeof="schema:Person"
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
                    property="schema:author"
                    typeof="schema:Person"
                  >
                    {cleanString(article.authorName)}
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Date</th>
                <td property="schema:datePublished">
                  {formatDate(cleanString(article.date))}
                </td>
              </tr>
              <tr>
                <th scope="row">Language</th>
                <td property="schema:inLanguage">
                  {getLanguageName(cleanString(article.language))}
                </td>
              </tr>
              <tr>
                <th scope="row">Description</th>
                <td property="schema:description">
                  {cleanString(article.description)}
                </td>
              </tr>
              <tr>
                <th scope="row">Category</th>
                <td property="schema:articleSection">
                  {extractLastPart(cleanString(article.subject))}
                </td>
              </tr>
              <tr>
                <th scope="row">URL</th>
                <td>
                  <a
                    href={article.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    property="schema:url"
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
                    property="schema:associatedMedia"
                    typeof="schema:MediaObject"
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
                    property="schema:sameAs"
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
            property="schema:associatedMedia"
            typeof="schema:MediaObject"
          ></iframe>
        </div>
      </div>
      {/* Carousel for recommended articles */}
      {recommendedArticles.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <h2>Recommended Articles</h2>
            <Carousel
              additionalTransfrom={0}
              arrows
              autoPlaySpeed={3000}
              draggable
              infinite
              keyBoardControl
              minimumTouchDrag={80}
              pauseOnHover
              responsive={{
                desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
                tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
                mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
              }}
              showDots={false}
              swipeable
              customLeftArrow={
                <button
                  className="carousel-left-arrow"
                  aria-label="Previous"
                  style={{
                    position: "absolute",
                    left: "-40px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "#fff",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  {"<"}
                </button>
              }
              customRightArrow={
                <button
                  className="carousel-right-arrow"
                  aria-label="Next"
                  style={{
                    position: "absolute",
                    right: "-40px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "#fff",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  {">"}
                </button>
              }
            >
              {recommendedArticles.map((article) => (
                <div
                  key={article.id}
                  style={{
                    padding: "15px",
                    width: "300px", // Set fixed width
                    height: "100%", // Ensure height is maintained
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  vocab="http://schema.org/"
                  typeof="schema:Article"
                >
                  <div
                    style={{
                      flex: "1 0 auto", // Ensure the card takes up available space
                    }}
                  >
                    <ArticleCardRecommendation article={article} />
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetailsPage;
