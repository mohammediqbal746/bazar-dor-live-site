import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "বাজার দর | Bazar Dor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" data-theme="light">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow max-w-6xl mx-auto w-full p-4">
          {children}
        </main>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}