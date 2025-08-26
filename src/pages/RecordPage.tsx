// src/pages/RecordPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import RecordingControls from "../components/RecordingControls";
import AudioVisualizer from "../components/AudioVisualizer";
import PatientInfoForm from "../components/PatientInfoForm";

const RecordPage: React.FC = () => {
  const { isRecording, currentRecording } = useAppContext();

  const navigate = useNavigate();

  // Navigate to results page after recording finishes
  React.useEffect(() => {
    if (currentRecording && !isRecording) {
      navigate(`/results/${currentRecording.id}`);
    }
  }, [currentRecording, isRecording, navigate]);

  return (
    <div className="space-y-8 px-4 py-8">
      {/* Header Section */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Voice Recording
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Record your voice for 8 seconds to analyze speech patterns and
          potential indicators. For best results, record in a quiet environment
          and speak naturally. The recording will automatically stop after 8
          seconds.
        </p>
      </section>

      {/* Recording Card Section */}
      <section className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="space-y-6">
            <AudioVisualizer isRecording={isRecording} />
            <RecordingControls />
          </div>
        </div>
      </section>

      {/* Patient Info Form */}
      <section className="max-w-3xl mx-auto">
        <PatientInfoForm />
      </section>
    </div>
  );
};

export default RecordPage;
