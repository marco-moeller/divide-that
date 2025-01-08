import { useEffect, useState } from "react";
import { getUserFromDatabase } from "../database/user";
import { getProfileImage } from "../API/profileImageAPI";

function useFriend(friendID) {
  const [friend, setFriend] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);

  useEffect(() => {
    const getFriend = async () => {
      if (!friendID) return null;
      try {
        setFriend(await getUserFromDatabase(friendID));
      } catch (error) {
        console.log(error);
        setFriend(null);
      }
    };
    getFriend();
  }, [friendID]);

  useEffect(() => {
    if (!friend) {
      return;
    }
    const getImgUrl = async () => {
      try {
        const url = await getProfileImage(friend.profileImage);
        setProfileImgUrl(url);
      } catch (error) {
        console.log(error);
        setProfileImgUrl(null);
      }
    };
    getImgUrl();
  }, [friend]);

  return { friend, profileImgUrl };
}

export default useFriend;
