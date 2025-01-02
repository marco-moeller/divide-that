import { memo } from "react";
import useFriend from "../../hooks/useFriend";
import { useAuth } from "../../context/AuthContext";

function GroupMember({ userID, setSelectedMember, getSelectedMemberClass }) {
  const { friend, profileImgUrl } = useFriend(userID);
  const { user } = useAuth();

  if (!friend) return;

  const handleClick = () => {
    if (userID === user.id) return;
    else setSelectedMember(userID);
  };

  return (
    <div
      className={`member ${
        userID === user.id ? "" : "pointer"
      } ${getSelectedMemberClass(userID)}`}
      onClick={handleClick}
    >
      <img
        src={profileImgUrl}
        alt="profile pic"
        className={`profile-pic-small `}
        style={{ zIndex: 5 }}
      />
      <p>{userID === user.id ? "You" : friend.userName}</p>
    </div>
  );
}

export default memo(GroupMember);
