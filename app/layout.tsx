import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk.ttf",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans.ttf",
  variable: "--font-plus-jakarta",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asta’s Preparation Dashboard",
  description: "Track Asta’s three training tasks and preparation-plan completion before confronting Lucifero.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
