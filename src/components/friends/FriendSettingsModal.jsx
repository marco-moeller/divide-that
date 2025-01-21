import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ModalHeader from "../modals/ModalHeader";
import { FaUserAltSlash } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { blockUser, removeFriendFromUser } from "../../API/userAPI";
import { MdOutlineReport } from "react-icons/md";
import FriendProfilePicture from "./FriendProfilePicture";
import ErrorComponent from "../error/ErrorComponent";
import useError from "../error/useError";
import ModalBody from "../modals/ModalBody";
import useVisibilityToggle from "../../hooks/useVisibilityToggle";
import ReportFriendModal from "../reports/ReportFriendModal";
import { usePopup } from "../../context/PopupContext";
import SubmitButton from "../layout/SubmitButton";

function FriendSettingsModal({ toggleModal, friend, profileImgUrl }) {
  const { user } = useAuth();
  const { error, setError } = useError();
  const { isShowing, toggle: toggleReportFriendModal } = useVisibilityToggle();
  const { isShowing: isShowingConfirmBtn, toggle: toggleConfirmBtn } =
    useVisibilityToggle();
  const {
    isShowing: isShowingConfirmBlockUSer,
    toggle: toggleConfirmBlockUSer
  } = useVisibilityToggle();
  const { showPopup } = usePopup();

  const navigate = useNavigate();

  const handleRemoveFriendClick = async () => {
    try {
      await removeFriendFromUser(user, friend.id);
      await removeFriendFromUser(friend, user.id);
      toggleModal();
      setError(null);
      navigate("/");
      showPopup(`removed ${friend.userName} from your friends`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleReportUserClick = () => {
    toggleReportFriendModal();
  };

  const handleBlockClick = async () => {
    try {
      await blockUser(user.id, friend.id);
      await removeFriendFromUser(user, friend.id);
      await removeFriendFromUser(friend, user.id);
      toggleModal();
      setError(null);
      navigate("/");
      showPopup(`${friend.userName} has been blocked`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <ModalHeader toggleModal={toggleModal}>Friend Settings</ModalHeader>
      <ModalBody>
        <section className="friend-settings">
          <ErrorComponent>{error}</ErrorComponent>
          <div className="flex pb-1em">
            <FriendProfilePicture profileImgUrl={profileImgUrl} />
            <div className="friend-info">
              <p>{friend.userName}</p>
              <p>{friend.email}</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="friend-settings-option" onClick={toggleConfirmBtn}>
            <FaUserAltSlash />
            <div>
              <p className="red">Remove from friends list</p>
              <p className="subtitle">Remove this user from your friend list</p>
            </div>{" "}
            {isShowingConfirmBtn && (
              <>
                <div></div>
                <SubmitButton
                  className="purple-btn bg-purple"
                  onClick={handleRemoveFriendClick}
                >
                  Confirm here
                </SubmitButton>
              </>
            )}
          </div>{" "}
          <div
            className="friend-settings-option"
            onClick={toggleConfirmBlockUSer}
          >
            <MdBlock />
            <div>
              <p className="red">Block User</p>
              <p className="subtitle">
                Remove this user from your friends list, hide any groups you
                share, and suppress future expenses/notifications from them.
              </p>
            </div>{" "}
            {isShowingConfirmBlockUSer && (
              <>
                <div></div>
                <SubmitButton
                  className="purple-btn bg-purple"
                  onClick={handleBlockClick}
                >
                  Confirm here
                </SubmitButton>
              </>
            )}
          </div>{" "}
          <div
            className="friend-settings-option"
            onClick={handleReportUserClick}
          >
            <MdOutlineReport />
            <div>
              <p className="red">Report User</p>
              <p className="subtitle">
                Flag an abusive, supsicious, or spam account
              </p>
            </div>{" "}
          </div>
        </section>
      </ModalBody>
      {isShowing && (
        <ReportFriendModal
          userID={user.id}
          friendID={friend.id}
          toggle={toggleReportFriendModal}
        />
      )}
    </>
  );
}

export default FriendSettingsModal;
