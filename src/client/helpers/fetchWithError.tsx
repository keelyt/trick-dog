import type { ServerError } from '../types';

/**
 * A React hook that fetches data from a URL and throws an error if the response status is not 200
 * or if the server returns an error message.
 * @param url The URL to fetch data from.
 * @param options The options for the fetch request.
 * @returns A promise that resolves to the response data.
 * @throws An error with a message indicating the status code and status text of the response, or the error message returned by the server.
 */
export default async function fetchWithError<T>(url: string, options?: RequestInit) {
  const response: Response = await fetch(url, options);

  if (response.status !== 200) throw new Error(`Error ${response.status}: ${response.statusText}`);

  const result: T | ServerError = (await response.json()) as T | ServerError;

  if ((result as ServerError).error) throw new Error((result as ServerError).error);

  return result as T;
}
