import { useAuth } from '../contexts/AuthContext';

import type { ServerError } from '../../types';

/**
 * A React hook for making authenticated fetch requests.
 * @returns The function for making the fetch requests.
 */
export default function useFetchWithAuth() {
  const { invalidate } = useAuth();

  /**
   * Fetches data from a URL and throws an error if an error occurs, the response is not JSON, or the user is not authenticated.
   * @template T The type of the response data.
   * @param url The URL to fetch data from.
   * @param options The options for the fetch request.
   * @returns A promise that resolves to the response data.
   * @throws An error with a message indicating the status code and status text of the response, or the error message returned by the server.
   */
  return async <T>(url: string, options?: RequestInit) => {
    const response: Response = await fetch(url, options);

    if ([401, 403].includes(response.status)) {
      invalidate();
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Unexpected response from server.');
    }

    const result: T | ServerError = (await response.json()) as T | ServerError;

    if ((result as ServerError).error) throw new Error((result as ServerError).error);

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    return result as T;
  };
}
