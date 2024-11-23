// util/fetchWrapper.ts
export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await fetch(`${import.meta.env.VITE_REACT_API_URL}${url}`, options);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Request failed");
    }
    return await response.json();
  };
  