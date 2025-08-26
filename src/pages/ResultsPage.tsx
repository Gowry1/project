import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AnalysisResult from "../components/AnalysisResult";
import PatientInfoForm from "../components/PatientInfoForm";
import { ArrowLeft, Mic } from "lucide-react";

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { recordings, setCurrentRecording } = useAppContext();
  const navigate = useNavigate();

  // Find the recording based on the id parameter
  const recording = recordings.find((rec) => rec.id === id);

  // Set current recording and redirect if not found
  useEffect(() => {
    if (recording) {
      setCurrentRecording(recording);
    } else if (recordings.length > 0) {
      navigate(`/results/${recordings[0].id}`);
    } else {
      navigate("/record");
    }
  }, [id, recording, recordings, navigate, setCurrentRecording]);

  if (!recording) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-400 mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to History
        </Link>
        <Link
          to="/record"
          className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <Mic className="h-4 w-4 mr-2" />
          New Recording
        </Link>
      </div>

      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Analysis Results
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Detailed analysis of your voice recording. These results provide
          insights into potential Parkinson's disease indicators.
        </p>
      </section>

      <section className="max-w-3xl mx-auto">
        <AnalysisResult
          result={recording.result}
          timestamp={recording.timestamp}
        />
      </section>

      <section className="max-w-3xl mx-auto">
        <PatientInfoForm />
      </section>
    </div>
  );
};

export default ResultsPage;
