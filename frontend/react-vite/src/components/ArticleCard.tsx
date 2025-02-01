import { Link } from "react-router-dom";
import { ArticleCard as ArticleCardType } from "../interfaces/ArticleCard";
interface ArticleCardProps {
  article: ArticleCardType;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => (
  <div className="col-md-4 mb-3">
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{article.headline.split("^^")[0]}</h5>
        <p className="card-text">{article.description.split("^^")[0]}</p>
        <img
          src={article.image}
          className="card-img-top"
          alt={article.headline.split("^^")[0]}
        />
        <Link to={`/article/${article.id}`} className="btn btn-primary">
          Read More
        </Link>
      </div>
    </div>
  </div>
);

export default ArticleCard;
