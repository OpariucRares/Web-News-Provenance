import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => (
  <div className="col-md-4 mb-3">
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{article.title}</h5>
        <p className="card-text">{article.summary}</p>
        <Link to={`/article/${article.id}`} className="btn btn-primary">
          Read More
        </Link>
      </div>
    </div>
  </div>
);

export default ArticleCard;
