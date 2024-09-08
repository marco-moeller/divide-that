import {
  createNewUserWithEmailAndPassword,
  deleteUserFromAuth,
  logoutUser,
  updateUserEmail,
  updateUserPassword
} from "../database/auth";
import { deleteImageFromDatabase } from "../database/profileImages";
import { addUserToDatabase, deleteUserFromDatabase } from "../database/user";

export const registerNewUser = async (userData) => {
  try {
    const user = await createNewUserWithEmailAndPassword(userData);
    await addUserToDatabase({
      ...userData,
      id: user.uid,
      password: null,
      confirmPassword: null
    });
  } catch (error) {
    console.log(error);
  }
};

export const acceptFriendRequest = async (user, friend) => {
  const updatedUser = await removeFriendRequestFromUser(user, friend.id);
  await addFriendToUser(updatedUser, friend.id);
  await addFriendToUser(friend, user.id);
};

export const addFriendRequestToFriend = async (friend, user) => {
  if (friend.friendRequests.includes(user.id)) {
    return;
  }
  await addUserToDatabase({
    ...friend,
    friendRequests: [...friend.friendRequests, user.id]
  });
  window.dispatchEvent(new Event("userUpdate"));
};

export const removeFriendRequestFromUser = async (user, friendID) => {
  const updatedUser = {
    ...user,
    friendRequests: user.friendRequests.filter(
      (request) => request !== friendID
    )
  };
  await addUserToDatabase(updatedUser);
  window.dispatchEvent(new Event("userUpdate"));
  return updatedUser;
};

export const addFriendToUser = async (user, friendID) => {
  if (user.friends.includes(friendID)) {
    return;
  }
  await addUserToDatabase({
    ...user,
    friends: [...user.friends, friendID]
  });
  window.dispatchEvent(new Event("userUpdate"));
};

export const removeFriendFromUser = async (user, friendID) => {
  await addUserToDatabase({
    ...user,
    friends: user.friends.filter((friend) => friend !== friendID)
  });

  window.dispatchEvent(new Event("userUpdate"));
};

export const addActivityToUser = async (user, activity) => {
  await addUserToDatabase({
    ...user,
    activities: [...user.activities, activity]
  });
};

export const updateUserData = async (user, userData) => {
  const updatedUser = {
    ...user,
    userName: userData.userName,
    defaultCurrency: userData.defaultCurrency,
    email: userData.email
  };
  await addUserToDatabase(updatedUser);
  await updateUserEmail(userData.email);
  if (userData.password !== "") {
    await updateUserPassword(userData.password);
  }
};

export const deleteUserAccount = async (userID, profileImage) => {
  try {
    if (profileImage !== "") {
      deleteImageFromDatabase("profileImages/" + profileImage);
    }
    await deleteUserFromAuth();
    await deleteUserFromDatabase(userID);
    await logoutUser();
  } catch (error) {
    console.log(error);
  }
};
