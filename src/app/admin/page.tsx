import { redirect } from "next/navigation";

import { Routes } from "@/lib/routes";

const AdminHome = () => {
  redirect(Routes.ADMIN_PHOTO);
};

export default AdminHome;
