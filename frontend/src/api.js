import axios from "axios";
import { useState } from "react";

// ✅ Axios Instance
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://customer-review-sentiment-analysis-4.onrender.com",
  timeout: 10000,
});

// ✅ Debug interceptors
API.interceptors.request.use((req) => {
  console.log("➡️ Request:", req.method?.toUpperCase(), req.url, req.data);
  return req;
});

API.interceptors.response.use(
  (res) => {
    console.log("✅ Response:", res.data);
    return res;
  },
  (err) => {
    console.error("❌ API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// ✅ Analyze Text API
const analyzeText = async (text) => {
  const res = await API.post("/reviews", { text }); // make sure backend route matches
  return res.data;
};

// ✅ Upload CSV API
const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // ⚠️ DO NOT manually set Content-Type (Axios handles it)
  const res = await API.post("/upload-csv", formData);

  return res.data;
};

// ✅ React Component
export default function SentimentDashboard() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 Analyze handler
  const handleAnalyze = async () => {
    if (!review.trim()) {
      alert("Please enter a review");
      return;
    }

    try {
      setLoading(true);
      setResult("Analyzing...");

      const data = await analyzeText(review);

      // handle different backend response formats
      setResult(
        data.sentiment ||
        data.result ||
        JSON.stringify(data)
      );
    } catch (err) {
      alert("Analysis failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // 📂 Upload handler
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);

      const data = await uploadCSV(file);

      console.log("Upload result:", data);

      alert("✅ Upload successful");

      // OPTIONAL: show summary if backend sends it
      if (data.summary) {
        alert(
          `Total: ${data.summary.total}\nPositive: ${data.summary.positive}\nNegative: ${data.summary.negative}`
        );
      }

    } catch (err) {
      alert("❌ Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Sentiment Dashboard</h2>

      {/* 🔍 Analyze Section */}
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Enter review..."
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Processing..." : "Analyze"}
      </button>

      <p>
        <strong>Result:</strong> {result}
      </p>

      <hr />

      {/* 📂 Upload Section */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}
