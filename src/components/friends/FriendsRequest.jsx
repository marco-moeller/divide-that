import {
  acceptFriendRequest,
  removeFriendRequestFromUser
} from "../../API/userAPI";
import { useAuth } from "../../context/AuthContext";
import useFriend from "../../hooks/useFriend";
import ErrorComponent from "../error/ErrorComponent";
import useError from "../error/useError";
import SubmitButton from "../layout/SubmitButton";

function FriendRequest({ request }) {
  const { friend, profileImgUrl } = useFriend(request);
  const { user } = useAuth();
  const { error, setError } = useError();

  const handleAcceptClick = async () => {
    try {
      await acceptFriendRequest(user.id, friend.id);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRejectClick = async () => {
    try {
      await removeFriendRequestFromUser(user, friend.id);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="friend-request">
      {" "}
      <div className="friend-request-info">
        <img src={profileImgUrl} alt="" className="profile-pic-tiny" />
        <p>{friend?.userName} wants to be your friend.</p>
      </div>
      <ErrorComponent>{error}</ErrorComponent>
      <div className="btns">
        <SubmitButton
          className="accept-req-btn btn"
          onClick={handleAcceptClick}
        >
          accept
        </SubmitButton>
        <SubmitButton
          className="accept-req-btn btn"
          onClick={handleRejectClick}
        >
          reject
        </SubmitButton>{" "}
      </div>
    </div>
  );
}

export default FriendRequest;
