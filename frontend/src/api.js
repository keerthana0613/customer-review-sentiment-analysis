import axios from "axios";
import { useState } from "react";

// ✅ Axios Instance
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://customer-review-sentiment-analysis-4.onrender.com",
  timeout: 10000,
});

// ✅ Debug interceptors (optional but helpful)
API.interceptors.request.use((req) => {
  console.log("Request:", req.url, req.data);
  return req;
});

API.interceptors.response.use(
  (res) => {
    console.log("Response:", res.data);
    return res;
  },
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// ✅ Analyze Text
const analyzeText = async (text) => {
  const res = await API.post("/reviews", { text });
  return res.data;
};

// ✅ Upload CSV
const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/upload-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ✅ React Component
export default function SentimentDashboard() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState("");
  const [file, setFile] = useState(null);

  // 🔍 Analyze handler
  const handleAnalyze = async () => {
    try {
      const data = await analyzeText(review);
      setResult(data.sentiment || JSON.stringify(data));
    } catch (err) {
      alert("Analysis failed");
    }
  };

  // 📂 Upload handler
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      const data = await uploadCSV(file);
      console.log(data);
      alert("Upload successful");
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sentiment Dashboard</h2>

      {/* Analyze Section */}
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Enter review..."
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleAnalyze}>Analyze</button>

      <p>
        <strong>Result:</strong> {result}
      </p>

      <hr />

      {/* Upload Section */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
}
