import { HiOutlineCog8Tooth } from "react-icons/hi2";
import BackButton from "../layout/BackButton";
import { memo } from "react";
import useModal from "../../hooks/useModal";
import FriendSettingsModal from "./FriendSettingsModal";
import Modal from "../modals/Modal";

function Hero({ friend, profileImgUrl }) {
  const { toggle, isShowing } = useModal();

  if (!friend) {
    return <></>;
  }

  return (
    <>
      <header>
        <div className="hero-bg">
          <BackButton />
          <HiOutlineCog8Tooth onClick={toggle} />
        </div>
        <img className="profile-pic" src={profileImgUrl} alt="profile pic" />
      </header>
      {isShowing && (
        <Modal>
          <FriendSettingsModal
            toggleModal={toggle}
            friend={friend}
            profileImgUrl={profileImgUrl}
          />
        </Modal>
      )}
    </>
  );
}

export default memo(Hero);
