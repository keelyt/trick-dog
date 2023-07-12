import type { ServerError } from '../../types';

/**
 * Fetches data from a URL and throws an error if an error occurs or if the response is not JSON.
 * @template T The type of the response data.
 * @param url The URL to fetch data from.
 * @param options The options for the fetch request.
 * @returns A promise that resolves to the response data.
 * @throws An error with a message indicating the status code and status text of the response, or the error message returned by the server.
 */
export default async function fetchWithError<T>(url: string, options?: RequestInit) {
  const response: Response = await fetch(url, options);

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Unexpected response from server.');
  }

  const result: T | ServerError = (await response.json()) as T | ServerError;

  if ((result as ServerError).error) throw new Error((result as ServerError).error);

  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

  return result as T;
}
