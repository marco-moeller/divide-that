import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import Modal from "../components/modals/Modal";
import ProfileImageUpload from "../components/account/ProfileImageUpload";
import useModal from "../hooks/useModal";
import AccountSettings from "../components/account/AccountSettings";
import { logoutUser } from "../database/auth";
import { getCurrencyName } from "../utility/money";
import useVisibilityToggle from "../hooks/useVisibilityToggle";
import { TbCameraPlus } from "react-icons/tb";
import ErrorComponent from "../components/error/ErrorComponent";
import useError from "../components/error/useError";

function Account() {
  const { user, profileImgUrl } = useAuth();
  const { error, setError } = useError();

  const navigate = useNavigate();
  const {
    isShowing: isShowingProfileImageUpload,
    toggle: toggleProfileImageUpload
  } = useModal();
  const { isShowing: isShowingAccountSettings, toggle: toggleAccountSettings } =
    useModal();

  const { toggle, isShowing } = useVisibilityToggle();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setError(null);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  if (!user) return <main></main>;

  return (
    <main className="account">
      <h2 className="title">Your Account</h2>

      <div className="account-info">
        <div className="account-image">
          {isShowing && !isMobile() && (
            <TbCameraPlus
              onClick={toggleProfileImageUpload}
              onMouseLeave={toggle}
            />
          )}
          {isMobile() && (
            <div className="mobile-camera-svg">
              <TbCameraPlus
                onClick={toggleProfileImageUpload}
                onMouseLeave={toggle}
              />
            </div>
          )}
          <img
            src={profileImgUrl}
            className="profile-pic"
            onMouseEnter={toggle}
            onClick={toggleProfileImageUpload}
          />
        </div>
        <h1 className="user-name" name="user-name" id="user-name">
          {user.userName}
        </h1>
        <h2 className="user-email" name="email" id="email">
          {user.email}
        </h2>
        <label htmlFor="currency">Default Currency</label>
        <h2 className="user-currency" name="currency" id="currency">
          {getCurrencyName(user.defaultCurrency)}
        </h2>
      </div>
      <div className="account-btn-wrapper">
        <ErrorComponent>{error}</ErrorComponent>
        <button className="btn" onClick={toggleAccountSettings}>
          <HiOutlineCog8Tooth />
          Settings
        </button>
        <button className="logout-btn btn" onClick={handleLogout}>
          <IoMdExit />
          Logout
        </button>
      </div>
      {isShowingProfileImageUpload && (
        <Modal>
          <ProfileImageUpload toggleModal={toggleProfileImageUpload} />
        </Modal>
      )}
      {isShowingAccountSettings && (
        <Modal>
          <AccountSettings toggleModal={toggleAccountSettings} />
        </Modal>
      )}
    </main>
  );
}

export default Account;
