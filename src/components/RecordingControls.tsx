import React, { useState, useEffect, useMemo } from "react";
import { Mic, Square, Timer } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import historyService from "../services/historyService";

const RecordingControls: React.FC = () => {
  const { isRecording, startRecording, stopRecording, setCurrentRecording } =
    useAppContext();
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and helps analyze speech patterns effectively.",
    "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where's the peck of pickled peppers Peter Piper picked?",
    "She sells seashells by the seashore. The shells she sells are surely seashells. So if she sells shells on the seashore, I'm sure she sells seashore shells.",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck as much wood as a woodchuck could chuck if a woodchuck could chuck wood.",
    "Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter. But a bit of better butter will make my batter better.",
    "Red leather, yellow leather. Red leather, yellow leather. Red leather, yellow leather. This phrase helps test pronunciation and speech clarity.",
    "The sixth sick sheik's sixth sheep's sick. This tongue twister challenges articulation and helps analyze speech patterns in voice analysis.",
    "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn't fuzzy, was he? This simple rhyme tests various speech sounds.",
    "I scream, you scream, we all scream for ice cream! The ice cream truck plays music as it drives through the neighborhood on sunny days.",
    "Around the rugged rock the ragged rascal ran. This alliterative sentence helps test the pronunciation of the 'R' sound in speech analysis.",
  ];

  const navigate = useNavigate();

  const randomSampleText = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    return sampleTexts[randomIndex];
  }, []);

  // Timer update during recording with auto-stop at 8 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          // Auto-stop recording after 8 seconds
          if (newTime >= 8) {
            // Use setTimeout to avoid state update during render
            setTimeout(() => handleStop(), 0);
          }
          return newTime;
        });
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Countdown before recording starts
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      handleActualStart();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountingDown, countdown]);

  const handleActualStart = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error("Failed to start recording:", error);
      setIsCountingDown(false);
    }
  };

  const handleStartRecording = () => {
    setCountdown(3);
    setIsCountingDown(true);
  };

  const handleStop = async () => {
    try {
      const result = await stopRecording();
      console.log("Recording result:", result);

      // Save result to database
      try {
        const saveResponse = await historyService.saveRecordingResult({
          disease_status: result.prediction || "NORMAL",
          confidence_score: result.percentage_normal || 50,
          recording_duration: recordingTime,
        });
        console.log("Result saved to database:", saveResponse);
      } catch (saveError) {
        console.error("Failed to save result to database:", saveError);
        // Continue with the flow even if saving fails
      }

      const newId = `rec_${Date.now()}`;

      setCurrentRecording({
        id: newId,
        timestamp: new Date(),
        duration: recordingTime,
        audioUrl: "", // Set actual URL if you have it
        result: {
          probability: result.prediction === "NORMAL" ? 0.2 : 0.8,
          confidence: (result.percentage_normal || 50) / 100,
          features: {
            jitter: 0.01,
            shimmer: 0.02,
            harmonicity: 0.9,
            pitch: 120,
          },
          prediction: result.prediction || "NORMAL",
          normal_count: result.normal_count || 0,
          total_words: result.total_words || 1,
          percentage_normal: result.percentage_normal || 50,
        },
      });

      navigate(`/results/${newId}`);
    } catch (error) {
      console.error("Error stopping recording:", error);
      // Show user-friendly error message
      alert("Failed to process recording. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Timer Display */}
      {isRecording && (
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center text-3xl font-mono text-primary">
            <Timer className="mr-2 h-6 w-6 text-red-500 animate-pulse" />
            <span>{formatTime(recordingTime)}</span>
            <span className="text-lg text-gray-500 ml-2">/ 0:08</span>
          </div>

          {/* Progress Bar */}
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(recordingTime / 8) * 100}%` }}
            ></div>
          </div>

          {/* Recording Status */}
          <div className="text-sm text-gray-600">
            {recordingTime < 8
              ? `Recording... ${8 - recordingTime} seconds remaining`
              : "Processing..."}
          </div>
        </div>
      )}

      {/* Countdown Display */}
      {isCountingDown && !isRecording && (
        <div className="flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary text-4xl font-bold text-primary animate-pulse">
          {countdown}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex justify-center space-x-6">
        {!isRecording && !isCountingDown ? (
          <button
            onClick={handleStartRecording}
            className="flex items-center justify-center w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-105"
            aria-label="Start recording"
          >
            <Mic className="h-10 w-10" />
          </button>
        ) : !isCountingDown ? (
          <button
            onClick={handleStop}
            className="flex items-center justify-center w-20 h-20 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg transition-transform transform hover:scale-105"
            aria-label="Stop recording"
          >
            <Square className="h-8 w-8" />
          </button>
        ) : null}
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-600 max-w-md mt-4">
        {isCountingDown ? (
          <p className="text-lg font-medium">Get ready to start speaking...</p>
        ) : isRecording ? (
          <p className="text-lg font-medium">
            Please read the following passage clearly for 8 seconds:
          </p>
        ) : (
          <p>
            Press the microphone button and read the text aloud in your natural
            speaking voice for 8 seconds. The recording will automatically stop.
          </p>
        )}
      </div>

      {/* Sample Text */}
      {isRecording && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg w-full max-w-2xl mt-4 border border-blue-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Please read this text aloud:
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {randomSampleText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
