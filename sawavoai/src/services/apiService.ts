import { authService } from './authService';

interface AuthenticatedFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export class ApiService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4008/api';

  static async authenticatedFetch(
    endpoint: string, 
    options: AuthenticatedFetchOptions = {}
  ): Promise<Response> {
    const { requireAuth = true, ...fetchOptions } = options;
    
    if (requireAuth) {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    // Ensure Content-Type is set for POST requests
    if (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT' || fetchOptions.method === 'PATCH') {
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      };
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    return fetch(url, fetchOptions);
  }
}
