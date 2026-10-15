import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Training progress POC",
  description: "A small experiment for Asta's training task completion and progress.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
