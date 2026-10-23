import { getPosts, parseJsonResponse, type Post } from "./api";

export type DemoScenario = "success" | "slow" | "http-error" | "empty";

// Only the client click handler uses this helper. Server sections call getPosts directly.
export async function getDemoPosts(scenario: DemoScenario): Promise<Post[]> {
  if (scenario === "http-error") {
    // This 503 is created here, not returned by JSONPlaceholder.
    return parseJsonResponse<Post[]>(new Response(null, { status: 503 }));
  }

  if (scenario === "empty") {
    // A local success response still goes through the real JSON parser.
    return parseJsonResponse<Post[]>(new Response("[]", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
  }

  if (scenario === "slow") {
    // Intentional learning simulation: pause, then make the real API request.
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
  }

  // Success and Slow both fetch the real employee 1 posts resource.
  return getPosts();
}
