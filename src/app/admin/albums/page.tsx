import AdminAlbumsHeader from "@/app/admin/albums/_components/header";
import { getAllAlbums } from "@/domain/photography/services/albums";

const AdminPhotoDashboard = async () => {
  const albums = await getAllAlbums();

  return (
    <>
      <AdminAlbumsHeader />

      <div>{albums.map(({ name }) => name)}</div>
    </>
  );
};

export default AdminPhotoDashboard;
