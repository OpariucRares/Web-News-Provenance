import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import { getArticleById } from "../api/sparqlApi";

import { Article as ArticleType } from "../interfaces/Article";
import Article from "../components/Article";

//de scos
import { fetchRelatedArticles } from "../api/articlesApi";

const ArticleDetailsPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState<string | null>(null);

  //de modificat
  const [relatedArticles, setRelatedArticles] = useState([]);

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
    fetchRelatedArticles(Number(articleId)).then(setRelatedArticles);
  }, [articleId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return <Article article={article} />;
};

export default ArticleDetailsPage;
