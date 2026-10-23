"use client";

import { useRef, useState } from "react";
import { errorMessage, getPosts, type Post } from "@/lib/api";

// State and click handlers need a Client Component.
export default function PostsExplorer() {
  // null means the button hasn't loaded anything yet.
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  // Nothing is fetched until this handler runs in the browser.
  async function loadPosts() {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      setPosts(await getPosts());
    } catch (error) {
      setError(errorMessage(error, "posts"));
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }

  return (
    <section className="panel explorer" aria-labelledby="explore-heading">
      <div className="explore-header">
        <div>
          <p className="eyebrow">THERE’S MORE TO READ</p>
          <h2 id="explore-heading">Explore all posts</h2>
          <p className="section-note">Read the full stories, whenever you’re ready.</p>
        </div>
        <button onClick={loadPosts} disabled={loading} aria-controls="all-posts">
          {loading ? "Loading posts…" : error ? "Try again" : posts ? "Refresh posts" : "Load all posts"}
          <span aria-hidden="true"> ↗</span>
        </button>
      </div>
      {/* A click fetch uses state for loading; Suspense doesn't watch event handlers. */}
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
