import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/app/_components/ui/sonner";
import { cn } from "@/lib/tailwind";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Carl-Adrien Mercey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={cn(
          "flex min-h-screen w-full justify-center bg-stone-950 font-sans text-stone-50 antialiased",
          inter.variable,
        )}
      >
        <NuqsAdapter>{children}</NuqsAdapter>

        <Toaster richColors />

        <Analytics />

        <SpeedInsights />
      </body>
    </html>
  );
}
