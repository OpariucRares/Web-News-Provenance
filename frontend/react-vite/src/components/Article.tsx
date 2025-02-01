import { Article as ArticleType } from "../interfaces/Article";

interface ArticleProps {
  article: ArticleType;
}

const Article: React.FC<ArticleProps> = ({ article }) => (
  <div className="container mt-4">
    <h1>{article.headline.split("^^")[0]}</h1>
    <p>
      <strong>Author:</strong> {article.authorName.split("^^")[0]}
    </p>
    <p>
      <strong>Date:</strong> {article.date.split("^^")[0]}
    </p>
    <p>
      <strong>Language:</strong> {article.language.split("^^")[0]}
    </p>
    <p>
      <strong>Description:</strong> {article.description.split("^^")[0]}
    </p>
    <img src={article.image} alt={article.headline.split("^^")[0]} />
    <a href={article.contentUrl} className="btn btn-primary">
      Read Full Article
    </a>
  </div>
);

export default Article;
