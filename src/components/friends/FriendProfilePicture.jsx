import { useNavigate } from "react-router-dom";

function FriendProfilePicture({ profileImgUrl, friendID }) {
  const navigate = useNavigate();
  const handleClick = () => {
    console.log("clicked");
    if (window.location.pathname !== `/friend/${friendID}`) {
      navigate(`/friend/${friendID}`);
    } else {
      navigate(0);
    }
  };

  return (
    <img
      src={profileImgUrl}
      alt="profile pic"
      className="profile-pic-small"
      onClick={handleClick}
    />
  );
}

export default FriendProfilePicture;
