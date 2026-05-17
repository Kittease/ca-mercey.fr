import { PropsWithChildren } from "react";

import { SidebarProvider } from "@/app/_components/ui/sidebar";

import AdminSidebar from "./_components/sidebar";

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="min-h-screen w-full">{children}</main>
    </SidebarProvider>
  );
};

export default AdminLayout;
