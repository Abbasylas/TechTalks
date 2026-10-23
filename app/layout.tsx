import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// Next.js uses this object for the browser title and page description.
export const metadata: Metadata = {
  title: "Vinland Saga | The Fan Journal",
  description: "English fan notes on Vinland Saga, Thorfinn, and the journey toward peace.",
};

// ReactNode lets children contain anything React can render, such as this page.
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
