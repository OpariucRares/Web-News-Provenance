const baseUrl = "https://localhost:7008/api/Statistics";

export const getListOfLanguages = async (): Promise<string[] | string> => {
  try {
    const response = await fetch(`${baseUrl}/languages`);
    if (!response.ok) {
      throw new Error("Failed to fetch languages");
    }
    const data = await response.json();
    if (data.statusCode === 200) {
      return data.content;
    } else {
      return data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}`;
  }
};

export const getArticleCountByLanguage = async (
  language: string
): Promise<BigInteger | string> => {
  try {
    const response = await fetch(
      `${baseUrl}/article-count-languages/${language}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch article count for ${language}`);
    }
    const data = await response.json();
    if (data.statusCode === 200) {
      return data.content;
    } else {
      return data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}`;
  }
};

export const getListOfCategories = async (): Promise<string[] | string> => {
  try {
    const response = await fetch(`${baseUrl}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    if (data.statusCode === 200) {
      return data.content;
    } else {
      return data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}`;
  }
};

export const getArticleCountByCategory = async (
  category: string
): Promise<BigInteger | string> => {
  try {
    const response = await fetch(
      `${baseUrl}/article-count-category/${category}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch count for category: ${category}`);
    }
    const data = await response.json();
    if (data.statusCode === 200) {
      return data.content;
    } else {
      return data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}`;
  }
};
