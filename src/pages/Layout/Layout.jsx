import { Toaster } from "@/shared/components";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default Layout;
