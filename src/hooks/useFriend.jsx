import { useEffect, useState } from "react";
import { getUserFromDatabase } from "../database/user";
import { getProfileImage } from "../API/profileImageAPI";

function useFriend(friendID) {
  const [friend, setFriend] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);

  useEffect(() => {
    const getFriend = async () => {
      if (!friendID) return null;
      setFriend(await getUserFromDatabase(friendID));
    };
    getFriend();
  }, [friendID]);

  useEffect(() => {
    if (!friend) {
      return;
    }
    const getImgUrl = async () => {
      const url = await getProfileImage(friend.profileImage);
      setProfileImgUrl(url);
    };
    getImgUrl();
  }, [friend]);

  return { friend, profileImgUrl };
}

export default useFriend;
