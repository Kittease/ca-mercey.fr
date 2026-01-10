"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";

import {
  CameraCursorFocusableElement,
  CameraCursorProvider,
} from "@/app/test/_components/camera-cursor";
import PictureGrid from "@/app/test/_components/picture-grid";
import { cn } from "@/lib/tailwind";

const TestPage = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CameraCursorProvider className="flex min-h-screen w-full flex-col items-center bg-[color-mix(in_oklch,var(--color-stone-900)_30%,var(--color-stone-950)_70%)] px-48 py-32">
        <nav
          className={cn(
            "fixed z-10 inset-x-0 top-0 justify-end flex flex-row gap-x-8 bg-stone-950/80 border-b-2 border-stone-950 py-8 px-32 backdrop-blur-3xl",
            "[&_a]:text-xl [&_a]:px-2 [&_a]:py-4 [&_a]:cursor-none [&_a]:font-bold [&_a]:text-stone-50 [&_a]:transition-all [&_a]:duration-300",
            "[&_a]:hover:text-emerald-400"
          )}
        >
          <CameraCursorFocusableElement className="mr-auto">
            <Link href="/">Carl-Adrien Mercey</Link>
          </CameraCursorFocusableElement>

          <CameraCursorFocusableElement>
            <Link href="/">Photography</Link>
          </CameraCursorFocusableElement>

          <CameraCursorFocusableElement>
            <Link href="/">Music</Link>
          </CameraCursorFocusableElement>

          <CameraCursorFocusableElement>
            <Link href="/">Beer</Link>
          </CameraCursorFocusableElement>

          <CameraCursorFocusableElement>
            <Link href="/">About Me</Link>
          </CameraCursorFocusableElement>
        </nav>

        <PictureGrid />
      </CameraCursorProvider>
    </QueryClientProvider>
  );
};

export default TestPage;
