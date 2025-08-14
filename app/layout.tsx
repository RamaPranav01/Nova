import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aegis - The Universal Trust Layer for AI",
  description: "Intelligent, real-time gateway that acts as a universal firewall and quality control system for AI models.",
  keywords: ["AI", "security", "trust", "gateway", "firewall", "LLM", "safety"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className={`${inter.className} h-full bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
