// src/pages/History.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ScanHistory {
  _id: string;
  date: string;
  result: string;
  confidence: number;
}

const History: React.FC = () => {
  const { token, user } = useAuth();
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        Please login to view your scan history.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Scan History</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading…</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-600">
          No previous scan records found.
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="p-4 rounded-xl shadow-md border border-gray-200 bg-white"
            >
              <p className="text-gray-700">
                <strong>Date:</strong> {new Date(item.date).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <strong>Result:</strong> {item.result}
              </p>
              <p className="text-gray-700">
                <strong>Confidence:</strong> {item.confidence}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
