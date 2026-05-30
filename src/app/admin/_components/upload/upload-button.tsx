"use client";

import { UploadIcon } from "lucide-react";
import { ChangeEvent, useRef } from "react";

import { Button } from "@/app/_components/ui/button";

import { useUpload } from "./context";
import { ALLOWED_MIME_TYPES } from "./types";

const ACCEPT = Array.from(ALLOWED_MIME_TYPES).join(",");

const UploadButton = () => {
  const { addFiles } = useUpload();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      addFiles(event.target.files);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={handleChange}
        className="sr-only"
      />

      <Button
        type="button"
        variant="default"
        size="default"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload photos"
      >
        <UploadIcon />
        Upload
      </Button>
    </>
  );
};

export default UploadButton;
