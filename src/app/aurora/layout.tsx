import { IBM_Plex_Mono, Syne } from "next/font/google";

import { cn } from "@/lib/tailwind";

import "./aurora.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-aurora-display",
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-aurora-mono",
  weight: ["400", "500", "600"],
});

const AuroraLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "aurora-page relative min-h-screen w-full overflow-x-hidden",
        syne.variable,
        plexMono.variable,
      )}
    >
      {/* Deep space background */}
      <div className="aurora-bg fixed inset-0 -z-10" />

      {/* Subtle star field */}
      <div className="aurora-stars fixed inset-0 -z-10" />

      {children}
    </div>
  );
};

export default AuroraLayout;
