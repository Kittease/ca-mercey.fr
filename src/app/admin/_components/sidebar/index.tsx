import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/app/_components/ui/sidebar";
import { Routes } from "@/lib/routes";

const AdminSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarMenuButton render={<a href={Routes.ADMIN}>Home</a>} isActive />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AdminSidebar;
