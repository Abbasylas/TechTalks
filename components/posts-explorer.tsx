"use client";

import { useRef, useState } from "react";
import { errorMessage, getPosts, type Post } from "@/lib/api";

// Each state holds only the data it needs.
type ExplorerState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; posts: Post[] }
  | { status: "empty" }
  | { status: "error"; message: string };

// State and click handlers need a Client Component.
export default function PostsExplorer() {
  // Start idle. Rendering this component never starts a request.
  const [state, setState] = useState<ExplorerState>({ status: "idle" });
  // A ref blocks rapid repeat clicks before React updates the button.
  const inFlight = useRef(false);
  const loading = state.status === "loading";

  // Nothing is fetched until this handler runs in the browser.
  // Click requests use loading state; Suspense doesn't watch event handlers.
  async function loadPosts() {
    if (inFlight.current) return;
    // Lock immediately, then show the loading state.
    inFlight.current = true;
    setState({ status: "loading" });
    try {
      // The direct API request starts here, in the browser after a click.
      const posts = await getPosts();
      setState(posts.length > 0 ? { status: "success", posts } : { status: "empty" });
    } catch (error) {
      // Handle failure here so the server sections stay untouched.
      setState({ status: "error", message: errorMessage(error, "posts") });
    } finally {
      // Unlock the button whether the request succeeds or fails.
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
        <button type="button" onClick={loadPosts} disabled={loading} aria-controls="all-posts">
          {loading ? "Loading posts…" : state.status === "error" ? "Try again" : "Load posts"}
          <span aria-hidden="true"> ↗</span>
        </button>
      </div>
      <div id="all-posts" aria-busy={loading}>
        <p role="status" className="explorer-status">
          {state.status === "idle" && "Click Load posts to read the full notes."}
          {loading && "Loading posts. Please wait…"}
          {state.status === "success" && `${state.posts.length} posts loaded.`}
          {state.status === "empty" && "No posts found"}
          {state.status === "error" && "Posts could not be loaded. You can try again."}
        </p>
        {state.status === "error" && <p role="alert" className="error">{state.message}</p>}
        {state.status === "success" && (
          <ol className="full-posts">
            {state.posts.map((post, index) => (
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
