import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ Correct named import
import { AnalysisResult as AnalysisResultType } from "../types";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResultType;
  timestamp: Date;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  result,
  timestamp,
}) => {
  const { probability, prediction, percentage_normal } = result;

  const getRiskLevel = () => {
    // Use percentage_normal to determine color
    // Above 80% normal = red (high concern)
    // 50-80% normal = orange (moderate concern)
    // Below 50% normal = green (low concern)
    if (percentage_normal > 80) return { level: "High", color: "red" };
    if (percentage_normal >= 50) return { level: "Moderate", color: "orange" };
    return { level: "Low", color: "green" };
  };

  const risk = getRiskLevel();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleSavePrediction = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Login required to save result.");
        return;
      }

      // ✅ Decode token to extract user_id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token);
      const userId = decoded?.user_id;

      if (!userId) {
        alert("Invalid token. Please log in again.");
        return;
      }

      const body = {
        disease_status: prediction?.toUpperCase(),
        percentage_normal: percentage_normal,
        user_id: userId,
      };

      console.log("📤 Sending prediction:", body);

      const response = await axios.post("http://localhost:5000/results", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Prediction saved:", response.data);
      alert("Prediction saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Save failed:", error?.response?.data || error.message);
      alert(
        "Failed to save prediction: " +
          (error?.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Analysis Results
          </h2>
          <div className="text-sm text-gray-500">{formatDate(timestamp)}</div>
        </div>

        {/* Primary Result */}
        <div
          className={`mb-6 p-5 rounded-lg ${
            risk.color === "green"
              ? "bg-green-50"
              : risk.color === "orange"
              ? "bg-orange-50"
              : "bg-red-50"
          }`}
        >
          <div className="flex items-center">
            {risk.color === "green" ? (
              <CheckCircle className="h-10 w-10 text-green-500 mr-4" />
            ) : (
              <AlertTriangle
                className={`h-10 w-10 ${
                  risk.color === "orange" ? "text-orange-500" : "text-red-500"
                } mr-4`}
              />
            )}
            <div>
              <h3 className="text-xl font-medium text-gray-800">
                {prediction}
              </h3>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      risk.color === "green"
                        ? "bg-green-500"
                        : risk.color === "orange"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${percentage_normal}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-gray-700 font-medium">
                  {percentage_normal}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {/* <div className="flex justify-end mt-4">
          <button
            onClick={handleSavePrediction}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Save Prediction
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default AnalysisResult;
