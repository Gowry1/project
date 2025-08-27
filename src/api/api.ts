import authService from "../services/authService";
import requestDeduplicationService from "../services/requestDeduplicationService";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

// Helper function to get authenticated headers
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await authService.getValidAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const result = await response.json();
  console.log("API Response:", result);

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      // Token might be expired, try to refresh or redirect to login
      throw new Error("Authentication required. Please log in again.");
    }
    throw new Error(result.error || result.message || "API request failed");
  }

  return result;
};

export const startRecording = async () => {
  try {
    console.log("API: Starting recording request...");
    const headers = await getAuthHeaders();

    // Use deduplication service to prevent duplicate calls
    const result = await requestDeduplicationService.executeRequest(
      `${BASE_URL}/start_recording`,
      {
        method: "POST",
        headers,
      }
    );

    console.log("API: Start recording successful:", result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Recording API Error:", error.message);
      throw error;
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error occurred during startRecording");
    }
  }
};

// Stop Recording
export const stopRecording = async () => {
  try {
    console.log("API: Stopping recording request...");
    const headers = await getAuthHeaders();

    // Use deduplication service to prevent duplicate calls
    const result = await requestDeduplicationService.executeRequest(
      `${BASE_URL}/stop_recording`,
      {
        method: "POST",
        headers,
      }
    );

    console.log("API: Stop recording successful:", result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Stop Recording API Error:", error.message);
      throw error;
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error occurred during stopRecording");
    }
  }
};

// Save analysis result
export const saveResult = async (data: {
  user_id: number;
  disease_status: string;
  confidence_score?: number;
}) => {
  try {
    console.log("API: Saving result request...");
    const headers = await getAuthHeaders();
    const body = JSON.stringify(data);

    // Use deduplication service to prevent duplicate calls
    const result = await requestDeduplicationService.executeRequest(
      `${BASE_URL}/results`,
      {
        method: "POST",
        headers,
        body,
      }
    );

    console.log("API: Save result successful:", result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Save Result API Error:", error.message);
      throw error;
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error occurred during saveResult");
    }
  }
};

// Get user results
export const getUserResults = async (userId: number) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/user-result/${userId}`, {
      method: "GET",
      headers,
    });

    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Get User Results API Error:", error.message);
      throw error;
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error occurred during getUserResults");
    }
  }
};
