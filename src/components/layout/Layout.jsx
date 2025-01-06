import { Outlet } from "react-router-dom";
import FooterNav from "./FooterNav";
import Popup from "../popups/Popup";
import MonetagAd from "../ads/MonetagAd";

function Layout() {
  return (
    <>
      <Outlet />
      <FooterNav />
      <Popup />
      {/* <MonetagAd /> */}
    </>
  );
}

export default Layout;
