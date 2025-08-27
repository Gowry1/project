import authService from "./authService";
import requestDeduplicationService from "./requestDeduplicationService";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export interface UserResult {
  id: number;
  disease_status: string;
  confidence_score: number | null;
  recording_duration?: number;
  audio_file_path?: string;
  created_at: string;
}

export interface UserHistoryResponse {
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    age: number;
    gender: string;
  };
  results: UserResult[];
}

class HistoryService {
  /**
   * Get user recording history by user ID
   */
  async getUserHistory(userId: number): Promise<UserHistoryResponse> {
    try {
      const accessToken = await authService.getValidAccessToken();
      if (!accessToken) {
        throw new Error("No valid access token available");
      }

      const response = await fetch(`${BASE_URL}/user-result/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Failed to fetch user history:", error);
      throw new Error(error.message || "Failed to fetch recording history");
    }
  }

  /**
   * Get current user's recording history
   */
  async getCurrentUserHistory(): Promise<UserHistoryResponse> {
    try {
      const accessToken = await authService.getValidAccessToken();
      if (!accessToken) {
        throw new Error("No valid access token available");
      }

      const response = await fetch(`${BASE_URL}/my-results`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Failed to fetch current user history:", error);
      throw new Error(
        error.message || "Failed to fetch your recording history"
      );
    }
  }

  /**
   * Save a new recording result
   */
  // async saveRecordingResult( {
  //   disease_status: string;
  //   confidence_score?: number;
  //   recording_duration?: number;
  // }): Promise<{ message: string; result_id: number }> {
  //   try {
  //     console.log("HistoryService: Saving recording result...");
  //     const accessToken = await authService.getValidAccessToken();
  //     if (!accessToken) {
  //       throw new Error("No valid access token available");
  //     }

  //     const requestData = {
  //       disease_status,
  //       percentage_normal,
  //       recording_duration,
  //     };

  //     console.log("requestData", requestData);
  //     // Use deduplication service to prevent duplicate calls
  //     const result = await requestDeduplicationService.executeRequest(
  //       `${BASE_URL}/results`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(requestData),
  //       }
  //     );

  //     console.log("HistoryService: Save recording result successful:", result);
  //     return result;
  //   } catch (error: any) {
  //     console.error("Failed to save recording result:", error);
  //     throw new Error(error.message || "Failed to save recording result");
  //   }
  // }

  async saveRecordingResult({
    disease_status,
    percentage_normal,
    recording_duration,
  }: {
    disease_status: string;
    percentage_normal: number;
    recording_duration?: number;
  }): Promise<any> {
    const accessToken = await authService.getValidAccessToken();
    if (!accessToken) throw new Error("No valid access token available");

    return requestDeduplicationService.executeRequest<any>(
      `${BASE_URL}/results`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease_status,
          percentage_normal,
          recording_duration,
        }),
      }
    );
  }

  /**
   * Convert backend result to frontend Recording format
   */
  convertToRecording(result: UserResult): any {
    const confidence = result.confidence_score
      ? result.confidence_score / 100
      : 0.5;
    const probability =
      result.disease_status === "NORMAL" ? 1 - confidence : confidence;

    return {
      id: `result_${result.id}`,
      timestamp: new Date(result.created_at),
      duration: result.recording_duration || 3,
      audioUrl: result.audio_file_path || "",
      result: {
        probability: probability,
        confidence: confidence,
        features: {
          jitter: 0.01,
          shimmer: 0.02,
          harmonicity: 0.9,
          pitch: 120,
        },
        prediction: result.disease_status,
        normal_count: result.disease_status === "NORMAL" ? 1 : 0,
        total_words: 1,
        percentage_normal: result.confidence_score || 50,
      },
    };
  }

  /**
   * Get recording history in frontend format
   */
  async getRecordingHistory(): Promise<any[]> {
    try {
      const historyData = await this.getCurrentUserHistory();
      return historyData.results.map((result) =>
        this.convertToRecording(result)
      );
    } catch (error: any) {
      console.error("Failed to get recording history:", error);
      return [];
    }
  }
}

// Export singleton instance
export const historyService = new HistoryService();
export default historyService;
