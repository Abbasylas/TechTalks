"use client";

import { useRef, useState } from "react";
import { errorMessage, getPosts, type Post } from "@/lib/api";

// State and click handlers need a Client Component.
export default function PostsExplorer() {
  // null means the button hasn't loaded anything yet.
  const [posts, setPosts] = useState<Post[] | null>(null);
  // These states control feedback for the button request.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // A ref blocks rapid repeat clicks before React updates the button.
  const inFlight = useRef(false);

  // Nothing is fetched until this handler runs in the browser.
  // Click requests use loading state; Suspense doesn't watch event handlers.
  async function loadPosts() {
    if (inFlight.current) return;
    // Mark this request as active and clear any old error.
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      // Wait for this browser request, then store the returned posts.
      setPosts(await getPosts());
    } catch (error) {
      // Keep any earlier posts visible if a refresh fails.
      setError(errorMessage(error, "posts"));
    } finally {
      // Unlock the button whether the request succeeds or fails.
      setLoading(false);
      inFlight.current = false;
    }
  }

  return (
    <section className="panel explorer" aria-labelledby="explore-heading">
      <div className="explore-header">
        <div>
          <p className="eyebrow">CHARACTERS, CHOICES, AND SECOND CHANCES</p>
          <h2 id="explore-heading">Explore all posts</h2>
          <p className="section-note">Read all our English notes on the Vinland Saga anime.</p>
        </div>
        <button onClick={loadPosts} disabled={loading} aria-controls="all-posts">
          {loading ? "Loading posts…" : error ? "Try again" : posts ? "Refresh posts" : "Load all posts"}
          <span aria-hidden="true"> ↗</span>
        </button>
      </div>
      <div id="all-posts" aria-busy={loading}>
        <p role="status" className="explorer-status">
          {loading ? "Getting the posts…" : posts ? `${posts.length} posts loaded.` : "Posts will appear here after you click."}
        </p>
        {error && <p role="alert" className="error">{error}</p>}
        {posts?.length === 0 && <p className="empty">No posts yet.</p>}
        {posts && posts.length > 0 && (
          <ol className="full-posts">
            {posts.map((post, index) => (
              <li key={post.id}>
                <article>
                  <span className="post-number">POST {String(index + 1).padStart(2, "0")}</span>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
