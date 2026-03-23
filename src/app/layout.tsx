import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/app-shell/AppShell";
import { siteConfig } from "@/lib/site-config";

import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

const themeInitScript = `
  (() => {
    const key = "site-theme-mode";
    const root = document.documentElement;
    const saved = window.localStorage.getItem(key);
    const mode = saved === "light" || saved === "dark" || saved === "auto" ? saved : "auto";
    const prefersDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
    root.dataset.theme = mode;
    root.classList.toggle("dark", resolved === "dark");
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
