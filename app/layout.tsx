import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee dashboard | TechTalks",
  description: "An employee profile, recent posts, and more to explore.",
};

// The shared layout sets the language and styles for the dashboard.
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
