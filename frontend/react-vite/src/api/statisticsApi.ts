const apiUrl = import.meta.env.BASE_API;
console.log("apiUrl", apiUrl);
const baseUrl = `${apiUrl}/Statistics`;

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
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
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
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
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
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
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
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return `Error: ${String(error)}`;
    }
  }
};

export const getDateArticlesBasedLanguage = async (
  language: string
): Promise<string[] | string> => {
  try {
    const response = await fetch(
      `${baseUrl}/dates-language-articles/${language}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch date article for language: ${language}`);
    }
    const data = await response.json();
    console.log(data);
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

export const getDateArticlesBasedCategory = async (
  category: string
): Promise<string[] | string> => {
  try {
    const response = await fetch(
      `${baseUrl}/dates-category-articles/${category}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch date article for category: ${category}`);
    }
    const data = await response.json();
    console.log(data);
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
