import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Recording,
  PatientInfo,
  User,
  LoginRequest,
  RegisterRequest,
} from "../types";
import { generateMockRecordings } from "../utils/mockData";
import { startRecording as apiStartRecording } from "../api/api";
import authService from "../services/authService";

interface AppContextType {
  // Recording related
  recordings: Recording[];
  currentRecording: Recording | null;
  patientInfo: PatientInfo | null;
  isRecording: boolean;
  addRecording: (recording: Recording) => void;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentRecording: (recording: Recording | null) => void;
  updatePatientInfo: (info: PatientInfo) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<RecordingResult>;

  // Authentication related
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

export interface RecordingResult {
  status: "success" | "error";
  prediction: string;
  selected_message: string;
  normal_count: number;
  total_words: number;
  percentage_normal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Recording state
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(
    null
  );
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Audio recording state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          // Get user from localStorage first
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }

          // Validate token with server and refresh user info
          try {
            const isValid = await authService.validateToken();
            if (isValid) {
              const userInfo = await authService.getUserInfo();
              setUser(userInfo);
            } else {
              // Token invalid, clear auth state
              setIsAuthenticated(false);
              setUser(null);
            }
          } catch (error) {
            console.error("Token validation failed:", error);
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load initial data
  useEffect(() => {
    // Load recordings from history service when user is authenticated
    // This will be handled by individual pages that need the data

    // Set default patient info
    const storedPatientInfo = localStorage.getItem("patientInfo");
    if (storedPatientInfo) {
      setPatientInfo(JSON.parse(storedPatientInfo));
    } else {
      const defaultPatient: PatientInfo = {
        id: "1",
        name: "",
        age: 0,
        gender: "",
        medicalHistory: "",
      };
      setPatientInfo(defaultPatient);
    }
  }, []);

  // Save patient info to localStorage
  useEffect(() => {
    if (patientInfo) {
      localStorage.setItem("patientInfo", JSON.stringify(patientInfo));
    }
  }, [patientInfo]);

  const addRecording = (recording: Recording) => {
    setRecordings((prev) => [recording, ...prev]);
  };

  const updatePatientInfo = (info: PatientInfo) => {
    setPatientInfo(info);
  };

  // Authentication methods
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      await authService.register(userData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAll = async () => {
    try {
      setIsLoading(true);
      await authService.logoutAll();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout all failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserInfo = async () => {
    try {
      const userInfo = await authService.getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error("Failed to refresh user info:", error);
      // If getting user info fails, user might be logged out
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Clear previous audio chunks
      setAudioChunks([]);

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);

      // Start recording
      recorder.start();
      setIsRecording(true);

      // Call backend API to start recording session
      const result = await apiStartRecording();
      if (result.status === "recording_started") {
        console.log("Recording started successfully:", result);
      } else {
        throw new Error(result.message || "Failed to start recording");
      }
    } catch (error: any) {
      setIsRecording(false);
      console.error("Error starting recording:", error);
      if (error.name === "NotAllowedError") {
        alert(
          "Microphone access is required for recording. Please allow microphone access and try again."
        );
      } else {
        alert("Error starting recording: " + error.message);
      }
      throw error;
    }
  };

  const stopRecording = async (): Promise<RecordingResult> => {
    try {
      // Stop the MediaRecorder if it exists
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();

        // Wait for the recording to finish and get the audio blob
        await new Promise<void>((resolve) => {
          mediaRecorder.onstop = () => resolve();
        });
      }

      // Create audio blob from chunks
      const audioBlob = new Blob(audioChunks, {
        type: "audio/webm;codecs=opus",
      });

      // Only send audio if we have actual data
      if (audioBlob.size === 0) {
        throw new Error("No audio data recorded");
      }

      // Send audio data to backend
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const token = await authService.getValidAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/stop_recording`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result: RecordingResult = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result?.prediction || "Failed to stop recording");
      }

      const newRecording: Recording = {
        id: `rec_${Date.now()}`,
        timestamp: new Date(),
        duration: 8, // 8 seconds recording duration
        audioUrl: "", // Replace with actual audio URL if your backend returns it
        result: {
          probability: Math.random(), // Optional simulated metric
          confidence: 1, // Optional simulated metric
          features: {
            jitter: 0, // Default or backend values
            shimmer: 0,
            harmonicity: 0,
            pitch: 0,
          },
          prediction: result.prediction,
          normal_count: result.normal_count,
          total_words: result.total_words,
          percentage_normal: result.percentage_normal,
        },
      };

      addRecording(newRecording);
      setCurrentRecording(newRecording);

      // Clear audio chunks for next recording
      setAudioChunks([]);
      setMediaRecorder(null);
      setIsRecording(false);

      return result;
    } catch (error) {
      setIsRecording(false);
      console.error("Stop recording failed:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Recording related
        recordings,
        currentRecording,
        patientInfo,
        isRecording,
        setIsRecording,
        addRecording,
        setCurrentRecording,
        updatePatientInfo,
        startRecording,
        stopRecording,

        // Authentication related
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        logoutAll,
        refreshUserInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
