import { Link } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  summary: string;
  image?: string;
}

interface CarouselProps {
  articles: Article[];
}

const Carousel = ({ articles }: CarouselProps) => {
  if (!articles || articles.length === 0) {
    return <p>No related articles available.</p>;
  }

  return (
    <div
      id="articleCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <Link to={`/article/${article.id}`}>
              <img
                src={article.image || "https://via.placeholder.com/800x400"}
                className="d-block w-100"
                alt={article.title}
                style={{ objectFit: "cover", height: "400px" }}
              />
            </Link>
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-2 rounded">
              <h5>{article.title}</h5>
              <p>{article.summary}</p>
              <Link to={`/article/${article.id}`} className="btn btn-primary">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#articleCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#articleCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
