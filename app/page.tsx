import { Suspense } from "react";
import Link from "next/link";
import EmployeeProfile from "@/components/employee-profile";
import RecentPosts from "@/components/recent-posts";
import PostsExplorer from "@/components/posts-explorer";

// The shell shows up right away. Each server section loads on its own.
export default function Dashboard() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="TechTalks home"><span className="brand-mark" aria-hidden="true">t.</span>TechTalks</Link>
        <span className="workspace">Employee workspace</span>
      </header>
      <main id="main" className="dashboard">
        <div className="intro">
          <p className="eyebrow">THE PEOPLE BEHIND THE POSTS</p>
          <h1>A little more connected.</h1>
          <p>Your employee profile and a window into what you share.</p>
        </div>
        <div className="overview">
          <section className="panel profile" aria-labelledby="profile-heading">
            <div className="section-heading"><h2 id="profile-heading">Employee profile</h2><span className="tag">01</span></div>
            {/* A slow profile won't hold up the title or the posts. */}
            <Suspense fallback={<p role="status" className="loading">Loading employee…</p>}>
              <EmployeeProfile />
            </Suspense>
          </section>
          <section className="panel recent" aria-labelledby="recent-heading">
            <div className="section-heading"><h2 id="recent-heading">Recent posts</h2><span className="tag">PREVIEW</span></div>
            <p className="section-note">A quick look at the first three posts.</p>
            {/* Suspense shows this message while the server waits for posts. */}
            <Suspense fallback={<p role="status" className="loading">Loading recent posts…</p>}>
              <RecentPosts />
            </Suspense>
          </section>
        </div>
        <PostsExplorer />
        <footer>TechTalks <span>Fictional employee data from JSONPlaceholder</span></footer>
      </main>
    </>
  );
}
