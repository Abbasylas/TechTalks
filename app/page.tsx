import { Suspense } from "react";
import Link from "next/link";
import EmployeeProfile from "@/components/employee-profile";
import RecentPosts from "@/components/recent-posts";
import PostsExplorer from "@/components/posts-explorer";

// The shell shows up right away. Each server section loads on its own.
// Each manual Suspense boundary covers only its async child, not the whole page.
// loading.tsx would cover the route segment; this demo needs a smaller boundary.
export default function Dashboard() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Vinland Saga home"><span className="brand-mark" aria-hidden="true">v.</span>Vinland Saga</Link>
        <span className="workspace">The fan journal</span>
      </header>
      <main id="main" className="dashboard">
        <div className="intro">
          <p className="eyebrow">BEYOND THE BATTLEFIELD</p>
          <h1>A journey toward peace.</h1>
          <p>Explore Thorfinn’s world through short notes on Vinland Saga, its characters, and what it means to be strong.</p>
        </div>
        <div className="overview">
          <section className="panel profile" aria-labelledby="profile-heading">
            <div className="section-heading"><h2 id="profile-heading">Contributor profile</h2><span className="tag">DEMO</span></div>
            <Suspense fallback={<p role="status" className="loading">Loading contributor profile…</p>}>
              <EmployeeProfile />
            </Suspense>
          </section>
          <section className="panel recent" aria-labelledby="recent-heading">
            <div className="section-heading"><h2 id="recent-heading">Notes from the journey</h2><span className="tag">PREVIEW</span></div>
            <p className="section-note">Three short reads on the world of Vinland Saga.</p>
            <p className="section-note">Learning simulation: this preview intentionally waits two seconds.</p>
            <Suspense fallback={<p role="status" className="loading">Loading recent posts… This preview includes an intentional two-second learning delay.</p>}>
              <RecentPosts />
            </Suspense>
          </section>
        </div>
        <PostsExplorer />
        <footer>
          <span>Vinland Saga · Unofficial fan journal</span>
          <span>Original fan notes · Demo profile from JSONPlaceholder</span>
          <a href="https://vinlandsaga.jp/introduction/" target="_blank" rel="noopener noreferrer">About the anime</a>
        </footer>
      </main>
    </>
  );
}
