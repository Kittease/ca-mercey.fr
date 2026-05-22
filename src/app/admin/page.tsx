import { Suspense } from "react";

import ServerSideAwait from "@/app/_components/await/server";
import AdminHeader from "@/app/admin/_components/admin-header";
import PhotoLayout from "@/app/admin/_components/photo-layout";
import PhotoWrapper from "@/app/admin/_components/photo-wrapper/select";
import { PhotoSelectionProvider } from "@/app/admin/_components/photo-wrapper/select/context";
import { getAllPhotos } from "@/domain/photography/services/photos";

const AdminDashboard = async () => {
  const photos = getAllPhotos();

  return (
    <PhotoSelectionProvider>
      <AdminHeader />

      <Suspense fallback={<PhotoLayout photos={[]} />}>
        <ServerSideAwait promise={photos}>
          {(photos) => (
            <PhotoLayout photos={photos} PhotoWrapper={PhotoWrapper} />
          )}
        </ServerSideAwait>
      </Suspense>
    </PhotoSelectionProvider>
  );
};

export default AdminDashboard;
