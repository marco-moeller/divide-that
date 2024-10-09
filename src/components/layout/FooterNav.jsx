import { NavLink } from "react-router-dom";
import { MdGroups } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { LuActivitySquare } from "react-icons/lu";
import { MdManageAccounts } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { memo } from "react";

function FooterNav() {
  const { isLoggedIn, profileImgUrl } = useAuth();

  return (
    <footer className="footer-nav">
      <nav>
        <NavLink to="/groups">
          <MdGroups />
          Groups
        </NavLink>
        <NavLink to="/friends">
          <MdOutlinePersonOutline />
          Friends
        </NavLink>
        <NavLink to="/activity">
          <LuActivitySquare />
          Activity
        </NavLink>
        {isLoggedIn && (
          <NavLink to="/account">
            <img
              src={profileImgUrl}
              alt="profile image"
              className="profile-pic-tiny"
            />
            Account
          </NavLink>
        )}{" "}
        {!isLoggedIn && (
          <NavLink to="/login">
            <MdManageAccounts />
            Login
          </NavLink>
        )}
      </nav>
    </footer>
  );
}

export default memo(FooterNav);