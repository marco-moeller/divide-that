import {
  acceptFriendRequest,
  removeFriendRequestFromUser
} from "../../API/userAPI";
import { useAuth } from "../../context/AuthContext";
import useFriend from "../../hooks/useFriend";

function FriendRequest({ request }) {
  const { friend, profileImgUrl } = useFriend(request);
  const { user } = useAuth();

  const handleAcceptClick = async () => {
    await acceptFriendRequest(user, friend);
  };

  const handleRejectClick = async () => {
    await removeFriendRequestFromUser(user, friend.id);
  };

  return (
    <div className="friend-request">
      {" "}
      <div className="friend-request-info">
        <img src={profileImgUrl} alt="" className="profile-pic-tiny" />
        <p>{friend?.userName} wants to be your friend.</p>
      </div>
      <div className="btns">
        <button className="accept-req-btn btn" onClick={handleAcceptClick}>
          accept
        </button>
        <button className="accept-req-btn btn" onClick={handleRejectClick}>
          reject
        </button>{" "}
      </div>
    </div>
  );
}

export default FriendRequest;
