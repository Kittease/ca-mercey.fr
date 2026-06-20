"use client";

import PhotoLayout from "@/app/admin/_components/photo-layout";
import PhotoWrapper from "@/app/admin/_components/photo-wrapper/select";
import { useUpload } from "@/app/admin/_components/upload/context";

const AdminPhotoGrid = () => {
  const { photos } = useUpload();

  return <PhotoLayout photos={photos} PhotoWrapper={PhotoWrapper} />;
};

export default AdminPhotoGrid;
