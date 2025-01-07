import { useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import articles from "../data/articles.json";

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const article = articles.find((a) => a.id === Number(id));
  const relatedArticles = articles
    .filter((a) => a.id !== Number(id))
    .slice(0, 3); // Exclude current article

  if (!article) return <div>Article not found!</div>;

  return (
    <div className="container mt-4">
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <img
        src={article.image || "https://via.placeholder.com/800x400"}
        className="img-fluid my-3"
        alt={article.title}
      />
      <h3 className="mt-5">Related Articles</h3>
      <Carousel articles={relatedArticles} />
    </div>
  );
};

export default ArticleDetailsPage;
