import AdminHeader from "@/app/admin/_components/admin-header";
import AdminPhotoGrid from "@/app/admin/_components/admin-photo-grid";
import { PhotoSelectionProvider } from "@/app/admin/_components/photo-wrapper/select/context";
import { UploadProvider } from "@/app/admin/_components/upload/context";
import DropZone from "@/app/admin/_components/upload/drop-zone";
import UploadSheet from "@/app/admin/_components/upload/upload-sheet";
import { getAllPhotos } from "@/domain/photography/services/photos";

const AdminDashboard = async () => {
  const photos = await getAllPhotos();

  return (
    <PhotoSelectionProvider>
      <UploadProvider initialPhotos={photos}>
        <DropZone />
        <AdminHeader />
        <AdminPhotoGrid />
        <UploadSheet />
      </UploadProvider>
    </PhotoSelectionProvider>
  );
};

export default AdminDashboard;
