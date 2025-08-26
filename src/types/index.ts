export interface VoiceFeatures {
  jitter: number;
  shimmer: number;
  harmonicity: number;
  pitch: number;
}

export interface AnalysisResult {
  probability: number; // 0-1 probability of Parkinson's
  confidence: number; // 0-1 confidence in the result
  features: VoiceFeatures;
  prediction: string;
  normal_count: number;
  percentage_normal: number;
  selected_message?: string;
}

export interface Recording {
  id: string;
  timestamp: Date;
  duration: number;
  audioUrl: string;
  result: {
    probability: number;
    confidence: number;
    features: {
      jitter: number;
      shimmer: number;
      harmonicity: number;
      pitch: number;
    };
    prediction: string;
    normal_count: number;
    total_words: number;
    percentage_normal: number;
  };
}




export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string;
}

// Authentication Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  username: string;
  email: string;
  password: string;
  age: number;
  gender: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
  token_type: string;
  user: User;
}

export interface RefreshTokenResponse {
  message: string;
  access_token: string;
  access_token_expires_in: number;
  token_type: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

export interface ApiError {
  message: string;
  status?: number;
}