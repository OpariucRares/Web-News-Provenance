import React from "react";
import { Link } from "react-router-dom";
import placeholderImage from "../assets/placeholder-image.jpg";
import { ArticleCard as ArticleCardType } from "../interfaces/ArticleCard";

interface ArticleCardProps {
  article: ArticleCardType;
}

const ArticleCardRecommendation: React.FC<ArticleCardProps> = ({ article }) => {
  const getImageUrl = (url: string) => {
    if (url.endsWith(".tif") || url.endsWith(".tiff")) {
      return placeholderImage;
    }
    return url;
  };

  const imageUrl = getImageUrl(article.image);

  return (
    <div
      className="card h-100"
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={article.headline.split("^^")[0]}
          style={{
            width: "100%",
            height: "200px",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          src={placeholderImage}
          alt="placeholder"
          style={{
            width: "100%",
            height: "200px",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            objectFit: "cover",
          }}
        />
      )}
      <div
        className="card-body d-flex flex-column"
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          flex: "1 0 auto",
        }}
      >
        <h5 className="card-title">{article.headline.split("^^")[0]}</h5>
        <p className="card-text flex-grow-1">
          <strong>Details:</strong> {article.description.split("^^")[0]}
        </p>
      </div>
      <div
        className="d-flex justify-content-center mb-3"
        style={{ padding: "20px" }}
      >
        <Link to={`/article/${article.id}`} className="btn btn-primary">
          Visualize
        </Link>
      </div>
    </div>
  );
};

export default ArticleCardRecommendation;
