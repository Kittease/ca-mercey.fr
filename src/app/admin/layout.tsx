import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { SidebarProvider } from "@/app/_components/ui/sidebar";
import { getAllAlbums } from "@/domain/photography/services/albums";
import { getAdminUser } from "@/lib/auth/admin";
import { Routes } from "@/lib/routes";

import AdminSidebar from "./_components/sidebar";

const AdminLayout = async ({ children }: PropsWithChildren) => {
  if (!(await getAdminUser())) {
    redirect(Routes.LOGIN);
  }

  const albums = await getAllAlbums();

  return (
    <SidebarProvider>
      <AdminSidebar albums={albums} />

      <main className="min-h-screen w-full">{children}</main>
    </SidebarProvider>
  );
};

export default AdminLayout;
