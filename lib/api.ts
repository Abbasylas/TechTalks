import { vinlandNote } from "./vinland-posts";

// The profile and both post views always use the same employee.
export const EMPLOYEE_ID = 1;
const API_URL = "https://jsonplaceholder.typicode.com";
export const POSTS_URL = `${API_URL}/posts?userId=${EMPLOYEE_ID}`;

// These types describe the API data; they don't validate it at runtime.
export type Employee = {
  id: number;
  name: string;
  email: string;
  company: { name: string };
};
export type Post = { userId: number; id: number; title: string; body: string };

// Keep the HTTP status so callers can tell a failed response from a network error.
export class ApiError extends Error {
  // Save the response status for a useful error message.
  readonly status: number;

  // Start with a normal Error, then add the HTTP status.
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// T is the response type the caller expects. async lets us await the request.
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    // Ask for fresh data; the preview delay has its own request-time guard.
    cache: "no-store",
    // Don't leave a loading message on screen forever.
    signal: AbortSignal.timeout(15000),
  });
  return parseJsonResponse<T>(response);
}

// Real requests and local demo responses use exactly the same checks.
export async function parseJsonResponse<T>(response: Response): Promise<T> {
  // fetch doesn't throw for HTTP errors such as 404 or 500.
  if (!response.ok) throw new ApiError("The request failed.", response.status);
  // Read the JSON body. Invalid JSON rejects and reaches the caller's catch.
  return response.json() as Promise<T>;
}

// Both views use this URL; the caller decides where the request runs.
export async function getPosts() {
  // This runs on the server for the preview and in the browser after a click.
  const posts = await fetchJson<Post[]>(POSTS_URL);
  // The API supplies demo records; our fan notes replace its placeholder Latin.
  return posts.map((post) => ({ ...post, ...vinlandNote(post.id) }));
}

// A caught value can be anything, so check its type before reading its status.
export function errorMessage(error: unknown, subject: string) {
  if (error instanceof ApiError) {
    return `Could not load ${subject} (HTTP ${error.status}). Please try again.`;
  }
  // A rejected fetch can have no Response and no HTTP status.
  if (error instanceof TypeError) {
    return `Could not load ${subject}. Check your connection and try again.`;
  }
  // Timeouts, invalid JSON, and other failures still get a safe message.
  return `Could not load ${subject}. Please try again.`;
}
