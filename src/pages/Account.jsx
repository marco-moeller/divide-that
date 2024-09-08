import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { MdOutlinePhotoCamera } from "react-icons/md";
import Modal from "../components/modals/Modal";
import ProfileImageUpload from "../components/account/ProfileImageUpload";
import useModal from "../hooks/useModal";
import AccountSettings from "../components/account/AccountSettings";
import { StatusProvider } from "../context/StatusContext";
import { logoutUser } from "../database/auth";
import { getCurrencyName } from "../utility/money";

function Account() {
  const { user, profileImgUrl } = useAuth();
  const navigate = useNavigate();
  const {
    isShowing: isShowingProfileImageUpload,
    toggle: toggleProfileImageUpload
  } = useModal();
  const { isShowing: isShowingAccountSettings, toggle: toggleAccountSettings } =
    useModal();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (!user) return <main></main>;

  return (
    <main className="account">
      <h2 className="title">Account</h2>
      <div className="account-info">
        <div className="account-image">
          <MdOutlinePhotoCamera onClick={toggleProfileImageUpload} />
          <img src={profileImgUrl} className="profile-pic" />
          <HiOutlineCog8Tooth onClick={toggleAccountSettings} />
        </div>
        <label htmlFor="user-name">Username</label>
        <h2 className="user-name" name="user-name" id="user-name">
          {user.userName}
        </h2>
        <label htmlFor="email">Email</label>
        <h2 className="user-email" name="email" id="email">
          {user.email}
        </h2>
        <label htmlFor="currency">Default Currency</label>
        <h2 className="user-currency" name="currency" id="currency">
          {getCurrencyName(user.defaultCurrency)}
        </h2>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <IoMdExit />
        Logout
      </button>
      {isShowingProfileImageUpload && (
        <Modal>
          <ProfileImageUpload toggleModal={toggleProfileImageUpload} />
        </Modal>
      )}
      {isShowingAccountSettings && (
        <Modal>
          <StatusProvider>
            <AccountSettings toggleModal={toggleAccountSettings} />
          </StatusProvider>
        </Modal>
      )}
    </main>
  );
}

export default Account;
