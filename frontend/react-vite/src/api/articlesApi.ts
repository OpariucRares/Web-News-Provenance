// src/api/articlesApi.ts
const dummyArticles = [
  {
    id: 1,
    title: "Viaje a la Patagonia septentrional",
    summary:
      "A journey to northern Patagonia, exploring its landscapes and culture.",
    image: "https://via.placeholder.com/800x400",
    language: "es",
    created: "1876-01-01T00:00:00Z",
    wordCount: 500,
  },
  {
    id: 2,
    title: "Proposed international nonproprietary names",
    summary:
      "A discussion on international nonproprietary names for pharmaceutical substances.",
    image: "https://via.placeholder.com/800x400",
    language: "es",
    created: "2009-01-01T00:00:00Z",
    wordCount: 1000,
  },
  {
    id: 3,
    title: "Dénominations communes internationales proposées",
    summary: "Proposed international common names in French.",
    image: "https://via.placeholder.com/800x400",
    language: "es",
    created: "2011-06-30T00:00:00Z",
    wordCount: 1200,
  },
];
export const fetchArticles = async () => {
  return dummyArticles;
};

export const fetchArticleById = async (id: number) => {
  return dummyArticles.find((article) => article.id === id) || null;
};

export const fetchRelatedArticles = async (id: number) => {
  return dummyArticles.filter((article) => article.id !== id);
};

/*
const API_BASE_URL = "http://localhost:5000/api"; // Change this to your actual backend URL

export const fetchArticles = async () => {
  const response = await fetch(`${API_BASE_URL}/articles`);
  return response.json();
};

export const fetchArticleById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`);
  return response.json();
};

export const fetchRelatedArticles = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}/related`);
  return response.json();
};

export const runSPARQLQuery = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/sparql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return response.json();
};
*/
