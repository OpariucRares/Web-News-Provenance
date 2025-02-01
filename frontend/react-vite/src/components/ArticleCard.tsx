import ImageIcon from "@mui/material/Icon";
import { Link } from "react-router-dom";
import { ArticleCard as ArticleCardType } from "../interfaces/ArticleCard";
import Avatar from "@mui/material/Avatar";
import React from "react";

interface ArticleCardProps {
  article: ArticleCardType;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const placeholderImage = "";

  const getImageUrl = (url: string) => {
    if (url.endsWith(".tif") || url.endsWith(".tiff")) {
      return placeholderImage;
    }
    return url;
  };

  const imageUrl = getImageUrl(article.image);

  return (
    <div className="col-md-4 mb-3">
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
          <Avatar
            src={imageUrl}
            alt={article.headline.split("^^")[0]}
            variant="square"
            sx={{
              width: "100%",
              height: "200px",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              objectFit: "cover",
            }}
          />
        ) : (
          <Avatar
            variant="square"
            sx={{
              width: "100%",
              height: "200px",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
            }}
          >
            <ImageIcon sx={{ fontSize: 80, color: "#b0b0b0" }} />
          </Avatar>
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
    </div>
  );
};

export default ArticleCard;
