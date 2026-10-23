import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vinland Saga | The Fan Journal",
  description: "English fan notes on Vinland Saga, Thorfinn, and the journey toward peace.",
};

// The shared layout sets the language and styles for the dashboard.
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
