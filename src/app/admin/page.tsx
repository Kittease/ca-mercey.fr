import AdminHeader from "@/app/admin/_components/admin-header";
import AdminPhotoGrid from "@/app/admin/_components/admin-photo-grid";
import { AlbumProvider } from "@/app/admin/_components/albums/context";
import { PhotoSelectionProvider } from "@/app/admin/_components/photo-wrapper/select/context";
import { UploadProvider } from "@/app/admin/_components/upload/context";
import DropZone from "@/app/admin/_components/upload/drop-zone";
import UploadSheet from "@/app/admin/_components/upload/upload-sheet";
import { getAllAlbums } from "@/domain/photography/services/albums";
import { getAllPhotos } from "@/domain/photography/services/photos";

const AdminDashboard = async () => {
  const [photos, albums] = await Promise.all([getAllPhotos(), getAllAlbums()]);

  return (
    <PhotoSelectionProvider>
      <UploadProvider initialPhotos={photos}>
        <AlbumProvider initialAlbums={albums}>
          <DropZone />
          <AdminHeader />
          <AdminPhotoGrid />
          <UploadSheet />
        </AlbumProvider>
      </UploadProvider>
    </PhotoSelectionProvider>
  );
};

export default AdminDashboard;
