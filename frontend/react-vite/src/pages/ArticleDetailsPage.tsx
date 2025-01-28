import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import { fetchArticleById, fetchRelatedArticles } from "../api/articlesApi";

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticleById(Number(id)).then(setArticle);
    fetchRelatedArticles(Number(id)).then(setRelatedArticles);
  }, [id]);

  if (!article) return <div>Loading...</div>;

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
