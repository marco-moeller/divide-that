import { getProfileImage } from "../API/profileImageAPI";
import { database, usersRef } from "./firebase";
import { deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const addUserToDatabase = async (user) => {
  try {
    await setDoc(doc(usersRef, user.id), user);
  } catch (error) {
    console.log(error);
  }
};

export const getUserFromDatabase = async (userID) => {
  try {
    const userRef = doc(database, "users", userID);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data();
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsersFromDatabase = async () => {
  let usersList = [];
  const snapshot = await getDocs(usersRef);
  snapshot.docs.forEach(async (doc) => usersList.push(doc.data()));

  let usersListWithImgurls = [];
  for (let user of usersList) {
    const profileImgUrl = await getProfileImage(user.profileImage);
    usersListWithImgurls.push({ ...user, profileImgUrl: profileImgUrl });
  }

  return usersListWithImgurls;
};

export const deleteUserFromDatabase = async (userID) => {
  try {
    await deleteDoc(doc(database, "users", userID));
  } catch (error) {
    console.log(error);
  }
};
