
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nova - AI Trust Layer", 
  description: "The Universal Trust Layer for AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body className={inter.className}>
        {children}
        <Toaster /> 
      </body>
    </html>
  );
}