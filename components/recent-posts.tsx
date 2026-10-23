import { connection } from "next/server";
import { errorMessage, getPosts, type Post } from "@/lib/api";

// Intentional learning simulation: keep this two-second delay in the demo.
const PREVIEW_DELAY_MS = 2000;

// This async Server Component waits inside its own Suspense boundary.
export default async function RecentPosts() {
  // Wait for a real request so the delay doesn't finish during the build.
  await connection();

  // Only this preview pauses. The page shell and profile can render separately.
  await new Promise<void>((resolve) => setTimeout(resolve, PREVIEW_DELAY_MS));

  // Post[] describes the records returned for employee 1.
  let posts: Post[];
  try {
    // getPosts uses /posts?userId=1 and adds our English fan-note text.
    posts = await getPosts();
  } catch (error) {
    // A failed preview stays inside this section.
    return <p role="alert" className="error">{errorMessage(error, "recent posts")} Refresh the page to retry.</p>;
  }
  // An empty response is valid; it isn't a request failure.
  if (posts.length === 0) return <p className="empty">No posts to preview yet.</p>;
  const preview = posts.slice(0, 3); // Show at most three titles.

  return (
    <ol className="preview-list">
      {preview.map((post, index) => (
        <li key={post.id}>
          <span className="post-number" aria-hidden="true">0{index + 1}</span>
          <h3>{post.title}</h3>
        </li>
      ))}
    </ol>
  );
}
