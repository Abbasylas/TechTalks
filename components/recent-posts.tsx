
import { errorMessage, getPosts } from "@/lib/api";
// This async Server Component waits inside its own Suspense boundary.
export default async function RecentPosts() {
  let posts;
  try {
    posts = await getPosts();
  } catch (error) {
    return <p role="alert" className="error">{errorMessage(error, "recent posts")} Refresh the page to retry.</p>;
  }
  if (posts.length === 0) return <p className="empty">No posts to preview yet.</p>;
  return (
    <ol className="preview-list">
      {posts.slice(0, 3).map((post, index) => (
        <li key={post.id}>
          <span className="post-number" aria-hidden="true">0{index + 1}</span>
          <h3>{post.title}</h3>
        </li>
      ))}
    </ol>
  );
}
