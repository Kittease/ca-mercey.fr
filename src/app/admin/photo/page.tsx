import { AlbumProvider } from "@/app/admin/_components/albums/context";
import { PhotoSelectionProvider } from "@/app/admin/_components/photo-wrapper/select/context";
import { UploadProvider } from "@/app/admin/_components/upload/context";
import DropZone from "@/app/admin/_components/upload/drop-zone";
import UploadSheet from "@/app/admin/_components/upload/upload-sheet";
import AdminPhotoHeader from "@/app/admin/photo/_components/header";
import AdminPhotoGrid from "@/app/admin/photo/_components/photo-grid";
import { getAllAlbums } from "@/domain/photography/services/albums";
import { getAllPhotos } from "@/domain/photography/services/photos";

const AdminPhotoDashboard = async () => {
  const [photos, albums] = await Promise.all([getAllPhotos(), getAllAlbums()]);

  return (
    <PhotoSelectionProvider>
      <UploadProvider initialPhotos={photos}>
        <AlbumProvider initialAlbums={albums}>
          <DropZone />

          <AdminPhotoHeader />

          <AdminPhotoGrid />

          <UploadSheet />
        </AlbumProvider>
      </UploadProvider>
    </PhotoSelectionProvider>
  );
};

export default AdminPhotoDashboard;
