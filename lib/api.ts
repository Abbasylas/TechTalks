export const EMPLOYEE_ID = 1;
const API_URL = "https://jsonplaceholder.typicode.com";
export const POSTS_URL = `${API_URL}/posts?userId=${EMPLOYEE_ID}`;

export type Employee = {
  id: number;
  name: string;
  email: string;
  company: { name: string };
};
export type Post = { userId: number; id: number; title: string; body: string };

// Keep the HTTP status so callers can tell a failed response from a network error.
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// async lets us wait for the response without blocking other work.
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    // Don't leave a loading message on screen forever.
    signal: AbortSignal.timeout(15000),
  });
  // fetch doesn't throw for HTTP errors such as 404 or 500.
  if (!response.ok) throw new ApiError("The request failed.", response.status);
  return response.json() as Promise<T>;
}

// Both views use this URL; the caller decides where the request runs.
export function getPosts() {
  return fetchJson<Post[]>(POSTS_URL);
}

export function errorMessage(error: unknown, subject: string) {
  return error instanceof ApiError
    ? `Could not load ${subject} (HTTP ${error.status}). Please try again.`
    : `Could not load ${subject}. Check your connection and try again.`;
}
