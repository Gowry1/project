/**
 * Request Deduplication Service
 * Prevents duplicate API calls by caching ongoing requests
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class RequestDeduplicationService {
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds timeout

  /**
   * Generate a unique key for the request
   */
  private generateKey(url: string, method: string, body?: string): string {
    const bodyHash = body ? btoa(body).slice(0, 10) : '';
    return `${method}:${url}:${bodyHash}`;
  }

  /**
   * Clean up expired requests
   */
  private cleanupExpiredRequests(): void {
    const now = Date.now();
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > this.REQUEST_TIMEOUT) {
        this.pendingRequests.delete(key);
        console.log(`Cleaned up expired request: ${key}`);
      }
    }
  }

  /**
   * Execute a request with deduplication
   */
  async executeRequest<T>(
    url: string,
    options: RequestInit,
    forceNew: boolean = false
  ): Promise<T> {
    const method = options.method || 'GET';
    const body = options.body as string;
    const key = this.generateKey(url, method, body);

    // Clean up expired requests
    this.cleanupExpiredRequests();

    // Check if we have a pending request for this key
    if (!forceNew && this.pendingRequests.has(key)) {
      const pendingRequest = this.pendingRequests.get(key)!;
      console.log(`Deduplicating request: ${key}`);
      return pendingRequest.promise;
    }

    // Create new request
    console.log(`Creating new request: ${key}`);
    const promise = fetch(url, options).then(async (response) => {
      // Remove from pending requests when completed
      this.pendingRequests.delete(key);
      
      // Handle response
      const result = await response.json();
      
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
        throw new Error(result.error || result.message || 'API request failed');
      }
      
      return result;
    }).catch((error) => {
      // Remove from pending requests on error
      this.pendingRequests.delete(key);
      throw error;
    });

    // Store the pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    });

    return promise;
  }

  /**
   * Cancel a specific request
   */
  cancelRequest(url: string, method: string, body?: string): void {
    const key = this.generateKey(url, method, body);
    if (this.pendingRequests.has(key)) {
      this.pendingRequests.delete(key);
      console.log(`Cancelled request: ${key}`);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    const count = this.pendingRequests.size;
    this.pendingRequests.clear();
    console.log(`Cancelled ${count} pending requests`);
  }

  /**
   * Get the number of pending requests
   */
  getPendingRequestCount(): number {
    this.cleanupExpiredRequests();
    return this.pendingRequests.size;
  }

  /**
   * Check if a specific request is pending
   */
  isRequestPending(url: string, method: string, body?: string): boolean {
    const key = this.generateKey(url, method, body);
    return this.pendingRequests.has(key);
  }

  /**
   * Get debug information about pending requests
   */
  getDebugInfo(): { key: string; timestamp: number; age: number }[] {
    const now = Date.now();
    return Array.from(this.pendingRequests.entries()).map(([key, request]) => ({
      key,
      timestamp: request.timestamp,
      age: now - request.timestamp
    }));
  }
}

// Export singleton instance
export const requestDeduplicationService = new RequestDeduplicationService();
export default requestDeduplicationService;
