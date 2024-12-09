import { Outlet } from "react-router-dom";
import FooterNav from "./FooterNav";
import Popup from "../popups/Popup";

function Layout() {
  return (
    <>
      <Outlet />
      <FooterNav />
      <Popup />
    </>
  );
}

export default Layout;
