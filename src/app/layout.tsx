import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import EnsureUserExists from "./_components/EnsureUserExists";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muslim Care",
  description: "Welcome to Muslim Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <body className={`font-sans ${inter.className}`}>
          <EnsureUserExists />
          <TopNav />
          <main className="min-h-screen pt-20 md:pt-24">{children}</main>
          <div id="modal-root" />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
