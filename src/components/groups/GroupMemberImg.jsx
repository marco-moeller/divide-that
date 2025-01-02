import useFriend from "../../hooks/useFriend";

function GroupMemberImg({ userID, index }) {
  const { profileImgUrl } = useFriend(userID);

  return (
    <img
      src={profileImgUrl}
      alt="profile pic"
      className="profile-pic-small"
      style={{ zIndex: 5 - index }}
    />
  );
}

export default GroupMemberImg;
