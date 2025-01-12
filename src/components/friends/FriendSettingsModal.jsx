import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ModalHeader from "../modals/ModalHeader";
import { FaUserAltSlash } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { removeFriendFromUser } from "../../API/userAPI";
import { MdOutlineReport } from "react-icons/md";
import FriendProfilePicture from "./FriendProfilePicture";
import ErrorComponent from "../error/ErrorComponent";
import useError from "../error/useError";
import ModalBody from "../modals/ModalBody";

function FriendSettingsModal({ toggleModal, friend, profileImgUrl }) {
  const { user } = useAuth();
  const { error, setError } = useError();

  const navigate = useNavigate();

  const handleRemoveFriendClick = async () => {
    try {
      await removeFriendFromUser(user, friend.id);
      await removeFriendFromUser(friend, user.id);
      toggleModal();
      setError(null);
      navigate("/");
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
          <div
            className="friend-settings-option"
            onClick={handleRemoveFriendClick}
          >
            <FaUserAltSlash />
            <div>
              <p className="red">Remove from friends list</p>
              <p className="subtitle">Remove this user from your friend list</p>
            </div>{" "}
          </div>{" "}
          <div className="friend-settings-option">
            <MdBlock />
            <div>
              <p className="red">Block User</p>
              <p className="subtitle">
                Remove this user from your friends list, hide any groups you
                share, and suppress future expenses/notifications from them.
              </p>
            </div>{" "}
          </div>{" "}
          <div className="friend-settings-option">
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
    </>
  );
}

export default FriendSettingsModal;
