import { Article as ArticleType } from "../interfaces/Article";

interface ArticleProps {
  article: ArticleType;
}

const Article: React.FC<ArticleProps> = ({ article }) => (
  <div className="container mt-4" vocab="http://schema.org/" typeof="Article">
    <h1 property="headline">{article.headline.split("^^")[0]}</h1>
    <p>
      <strong>Author:</strong>
      <span property="author">{article.authorName.split("^^")[0]}</span>
    </p>
    <p>
      <strong>Date:</strong>
      <span property="datePublished">{article.date.split("^^")[0]}</span>
    </p>
    <p>
      <strong>Language:</strong>
      <span property="inLanguage">{article.language.split("^^")[0]}</span>
    </p>
    <p>
      <strong>Description:</strong>
      <span property="description">{article.description.split("^^")[0]}</span>
    </p>
    <img
      src={article.image}
      alt={article.headline.split("^^")[0]}
      property="image"
    />
    <a href={article.contentUrl} className="btn btn-primary" property="url">
      Read Full Article
    </a>
  </div>
);

export default Article;
