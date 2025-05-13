export const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error(
      "API URL not configured. Please check your environment variables.",
    );
  }
  return apiUrl;
};
