import axios, { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
  AuthTokens,
  ApiError
} from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_EXPIRES_KEY = 'access_token_expires_at';
const REFRESH_TOKEN_EXPIRES_KEY = 'refresh_token_expires_at';
const USER_KEY = 'user';

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private accessTokenExpiresAt: number = 0;
  private refreshTokenExpiresAt: number = 0;

  constructor() {
    this.loadTokensFromStorage();
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    this.accessTokenExpiresAt = parseInt(localStorage.getItem(ACCESS_TOKEN_EXPIRES_KEY) || '0');
    this.refreshTokenExpiresAt = parseInt(localStorage.getItem(REFRESH_TOKEN_EXPIRES_KEY) || '0');
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokensToStorage(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(ACCESS_TOKEN_EXPIRES_KEY, tokens.accessTokenExpiresAt.toString());
    localStorage.setItem(REFRESH_TOKEN_EXPIRES_KEY, tokens.refreshTokenExpiresAt.toString());
    
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.accessTokenExpiresAt = tokens.accessTokenExpiresAt;
    this.refreshTokenExpiresAt = tokens.refreshTokenExpiresAt;
  }

  /**
   * Clear tokens from storage
   */
  private clearTokensFromStorage(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_KEY);
    localStorage.removeItem(USER_KEY);
    
    this.accessToken = null;
    this.refreshToken = null;
    this.accessTokenExpiresAt = 0;
    this.refreshTokenExpiresAt = 0;
  }

  /**
   * Check if access token is expired
   */
  private isAccessTokenExpired(): boolean {
    if (!this.accessToken || !this.accessTokenExpiresAt) return true;
    return Date.now() >= this.accessTokenExpiresAt;
  }

  /**
   * Check if refresh token is expired
   */
  private isRefreshTokenExpired(): boolean {
    if (!this.refreshToken || !this.refreshTokenExpiresAt) return true;
    return Date.now() >= this.refreshTokenExpiresAt;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await axios.post(
        `${BASE_URL}/register`,
        userData
      );
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Registration failed',
        status: error.response?.status
      };
      throw apiError;
    }
  }

  /**
   * Login user and store tokens
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `${BASE_URL}/login`,
        credentials
      );

      const data = response.data;
      
      // Calculate expiration timestamps
      const now = Date.now();
      const accessTokenExpiresAt = now + (data.access_token_expires_in * 1000);
      const refreshTokenExpiresAt = now + (data.refresh_token_expires_in * 1000);

      // Save tokens
      this.saveTokensToStorage({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      });

      // Save user data
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status
      };
      throw apiError;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken || this.isRefreshTokenExpired()) {
      throw new Error('No valid refresh token available');
    }

    try {
      const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        `${BASE_URL}/refresh`,
        { refresh_token: this.refreshToken }
      );

      const data = response.data;
      const now = Date.now();
      const accessTokenExpiresAt = now + (data.access_token_expires_in * 1000);

      // Update access token
      this.accessToken = data.access_token;
      this.accessTokenExpiresAt = accessTokenExpiresAt;
      
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      localStorage.setItem(ACCESS_TOKEN_EXPIRES_KEY, accessTokenExpiresAt.toString());

      return data.access_token;
    } catch (error: any) {
      // If refresh fails, clear all tokens
      this.clearTokensFromStorage();
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Token refresh failed',
        status: error.response?.status
      };
      throw apiError;
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    if (!this.accessToken) return null;

    if (this.isAccessTokenExpired()) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return this.accessToken;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const accessToken = await this.getValidAccessToken();
      
      if (accessToken && this.refreshToken) {
        await axios.post(
          `${BASE_URL}/logout`,
          { refresh_token: this.refreshToken },
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      this.clearTokensFromStorage();
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAll(): Promise<void> {
    try {
      const accessToken = await this.getValidAccessToken();
      
      if (accessToken) {
        await axios.post(
          `${BASE_URL}/logout-all`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
      }
    } catch (error) {
      console.error('Logout all API call failed:', error);
    } finally {
      this.clearTokensFromStorage();
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem(USER_KEY);
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.accessToken && !this.isRefreshTokenExpired());
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Validate current token with server
   */
  async validateToken(): Promise<boolean> {
    try {
      const accessToken = await this.getValidAccessToken();
      if (!accessToken) return false;

      const response = await axios.post(
        `${BASE_URL}/validate-token`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      return response.data.valid === true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Get user info from server
   */
  async getUserInfo(): Promise<User> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) {
      throw new Error('No valid access token');
    }

    try {
      const response: AxiosResponse<{ user: User }> = await axios.get(
        `${BASE_URL}/me`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const user = response.data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Failed to get user info',
        status: error.response?.status
      };
      throw apiError;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
