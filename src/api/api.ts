import authService from '../services/authService';

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

// Helper function to get authenticated headers
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await authService.getValidAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const result = await response.json();
console.log('API Response:', result);

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      // Token might be expired, try to refresh or redirect to login
      throw new Error('Authentication required. Please log in again.');
    }
    throw new Error(result.error || result.message || 'API request failed');
  }

  return result;
};

export const startRecording = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/start_recording`, {
      method: 'POST',
      headers,
    });

    return await handleApiResponse(response);
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
  console.log('Stop Recording API Called');
  
  try {
    console.log('Stop Recording API Called0222');
    
    const headers = await getAuthHeaders();
    console.log('Stop Recording API Headers:', headers);
    
    const response = await fetch(`${BASE_URL}/stop_recording`, {
      method: 'POST',
      headers,
    });
    console.log('Stop Recording API Response:', response);
    

    return await handleApiResponse(response);
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/results`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return await handleApiResponse(response);
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
      method: 'GET',
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

