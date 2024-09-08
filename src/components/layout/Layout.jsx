import { Outlet } from "react-router-dom";
import FooterNav from "./FooterNav";

function Layout() {
  return (
    <>
      <Outlet />
      <FooterNav />
    </>
  );
}

export default Layout;
