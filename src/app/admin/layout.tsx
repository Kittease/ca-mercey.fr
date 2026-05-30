import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { SidebarProvider } from "@/app/_components/ui/sidebar";
import { getAdminUser } from "@/lib/auth/admin";
import { Routes } from "@/lib/routes";

import AdminSidebar from "./_components/sidebar";

const AdminLayout = async ({ children }: PropsWithChildren) => {
  if (!(await getAdminUser())) {
    redirect(Routes.LOGIN);
  }

  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="min-h-screen w-full">{children}</main>
    </SidebarProvider>
  );
};

export default AdminLayout;
