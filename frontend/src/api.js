import axios from "axios";

const API = axios.create({
  baseURL: "https://customer-review-sentiment-analysis-4.onrender.com",
});

export const analyzeText = (text) => 
  API.post("/reviews", { text });
};
export const uploadCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
