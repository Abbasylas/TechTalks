"use client";

import { useRef, useState } from "react";
import { errorMessage, type Post } from "@/lib/api";
import { getDemoPosts, type DemoScenario } from "@/lib/demo-scenarios";

const scenarioLabels: Record<DemoScenario, string> = {
  success: "Success — real API request",
  slow: "Slow — two-second delay, then real API request",
  "http-error": "HTTP error — local 503 simulation",
  empty: "Empty — local empty-array simulation",
};

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
  // Changing the selector doesn't fetch or change existing results.
  const [scenario, setScenario] = useState<DemoScenario>("success");
  // Remember which scenario produced the current result, even if the selection changes.
  const [lastScenario, setLastScenario] = useState<DemoScenario | null>(null);
  // A ref blocks rapid repeat clicks before React updates the button.
  const inFlight = useRef(false);
  const loading = state.status === "loading";

  // Nothing is fetched until this handler runs in the browser.
  // Click requests use loading state; Suspense doesn't watch event handlers.
  async function loadPosts() {
    if (inFlight.current) return;
    // Lock immediately, then show the loading state.
    inFlight.current = true;
    // Capture this choice for this attempt only.
    const selectedScenario = scenario;
    setLastScenario(selectedScenario);
    setState({ status: "loading" });
    try {
      // Real and simulated responses go through the same response checks.
      const posts = await getDemoPosts(selectedScenario);
      setState(posts.length > 0 ? { status: "success", posts } : { status: "empty" });
    } catch (error) {
      // errorMessage checks for ApiError before handling network or other failures.
      // Keeping the catch here leaves the server sections untouched.
      setState({ status: "error", message: errorMessage(error, "posts") });
    } finally {
      // Success, empty, and error all replace loading before we unlock the button.
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
          {loading ? "Loading posts…" : state.status === "error" ? "Retry" : "Load posts"}
          <span aria-hidden="true"> ↗</span>
        </button>
      </div>
      <div className="demo-controls">
        <label className="demo-field" htmlFor="demo-scenario">
          Demo scenario
          <select id="demo-scenario" value={scenario} disabled={loading}
            aria-describedby="demo-help"
            onChange={(event) => setScenario(event.currentTarget.value as DemoScenario)}>
            {Object.entries(scenarioLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <p id="demo-help" className="section-note">
          Learning simulations. Your selection applies to the next Load posts or Retry action only.
          Success and Slow use JSONPlaceholder. HTTP error and Empty are created locally.
          The server profile and preview are unaffected.
        </p>
      </div>
      <div id="all-posts" aria-busy={loading}>
        {lastScenario && <p className="section-note">Last attempt: {scenarioLabels[lastScenario]}.</p>}
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
