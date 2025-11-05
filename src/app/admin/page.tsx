import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getAllPictures } from "@/domain/photography/services/pictures";
import { Routes } from "@/lib/routes";
import { getAdminUser } from "@/lib/supabase/server";

import ServerSideAwait from "@/app/_components/await/server";
import Gallery from "@/app/admin/_components/gallery";

const AdminDashboard = async () => {
  if (!(await getAdminUser())) {
    redirect(Routes.LOGIN);
  }

  return (
    <Suspense fallback={<Gallery pictures={[]} />}>
      <ServerSideAwait promise={getAllPictures()}>
        {(pictures) => <Gallery pictures={pictures} />}
      </ServerSideAwait>
    </Suspense>
  );
};

export default AdminDashboard;
