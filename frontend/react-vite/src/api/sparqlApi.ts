import { Article } from "../interfaces/Article";
import { ArticleCard } from "../interfaces/ArticleCard";
import { SparqlResponse } from "../interfaces/SparqlResponse";
import { Filters } from "../interfaces/Filters";

const apiUrl = import.meta.env.VITE_BASE_API;
const baseUrl = `${apiUrl}/Sparql`;

export const getAllArticleCardsPagination = async (
  offset: number
): Promise<ArticleCard[] | string> => {
  try {
    const response = await fetch(`${baseUrl}/article-cards/${offset}`);
    if (!response.ok) {
      throw new Error("Failed to fetch article cards");
    }
    const data: SparqlResponse<ArticleCard[]> = await response.json();
    if (data.statusCode === 200) {
      return data.content;
    } else {
      return data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
  }
};

export const getArticleById = async (
  articleId: string
): Promise<Article | string> => {
  try {
    const response = await fetch(`${baseUrl}/${articleId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch article");
    }
    const data: SparqlResponse<Article> = await response.json();
    if (data.statusCode === 200) {
      return data.content;
    } else {
      return data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
  }
};

export const searchArticleCards = async (
  search: string,
  offset: number
): Promise<ArticleCard[] | string> => {
  try {
    const response = await fetch(
      `${baseUrl}/article-cards-search/${offset}?search=${search}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to search article cards");
    }
    return data.content as ArticleCard[];
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return "Failed to search article cards";
    }
  }
};

export const getFilteredArticleCards = async (
  offset: number,
  filters: Filters
): Promise<ArticleCard[] | string> => {
  try {
    const response = await fetch(`${baseUrl}/article-cards-filters/${offset}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });
    const data: SparqlResponse<ArticleCard[]> = await response.json();
    if (response.ok && data.statusCode === 200) {
      return data.content;
    } else {
      return data.message || "Failed to fetch filtered article cards";
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
  }
};

export const getRecommendedArticles = async (
  category: string
): Promise<ArticleCard[] | string> => {
  try {
    const response = await fetch(`${baseUrl}/recommended-articles/${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch recommended articles");
    }
    const data: SparqlResponse<ArticleCard[]> = await response.json();
    if (data.statusCode === 200) {
      return data.content;
    } else {
      return data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
  }
};

export const fetchArticles = async () => {
  return 1;
};

export const fetchArticleById = async (id: number) => {
  return 1;
};

export const fetchRelatedArticles = async (id: number) => {
  return [];
};

export const runSPARQLQuery = async (
  query: string,
  endpoint: string
): Promise<string | null> => {
  const url = `${baseUrl}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();

    if (data.statusCode === 200) {
      return data.content.replace(/[\t\n\r]/g, "");
    } else {
      return `Error: ${data.message}`;
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
  }
};
