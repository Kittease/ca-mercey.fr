"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import { usePhotoSelection } from "@/app/admin/_components/photo-wrapper/select/context";
import UploadButton from "@/app/admin/_components/upload/upload-button";
import { UploadSheetTrigger } from "@/app/admin/_components/upload/upload-sheet";
import { cn } from "@/lib/tailwind";

const AdminHeader = () => {
  const { clearSelection, selectedPhotoCount } = usePhotoSelection();

  const title =
    selectedPhotoCount > 0
      ? `${selectedPhotoCount} photos selected`
      : "Photography Admin";

  return (
    <header
      className={cn(
        "[--header-pad-x:--spacing(8)]",
        "sticky top-0 z-40 flex w-full flex-row items-center justify-between bg-card py-6 pr-(--header-pad-x) pl-[calc(2*var(--header-pad-x)+--spacing(10))]",
      )}
    >
      <div className="absolute top-1/2 left-(--header-pad-x) -translate-y-1/2">
        {selectedPhotoCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Clear selected photos"
            onClick={clearSelection}
            className="[&_svg]:size-5!"
          >
            <XIcon />
          </Button>
        ) : (
          <SidebarTrigger size="icon-lg" className="[&_svg]:size-5!" />
        )}
      </div>

      <h1 className="text-lg">{title}</h1>

      <div className="flex items-center gap-2">
        <UploadSheetTrigger />
        <UploadButton />
      </div>
    </header>
  );
};

export default AdminHeader;
