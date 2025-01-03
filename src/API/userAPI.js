import {
  createNewUserWithEmailAndPassword,
  deleteUserFromAuth,
  logoutUser,
  updateUserEmail,
  updateUserPassword
} from "../database/auth";
import { getExpensesFromDatabase } from "../database/expenses";
import { deleteImageFromDatabase } from "../database/profileImages";
import { addUserToDatabase, deleteUserFromDatabase } from "../database/user";

export const registerNewUser = async (userData, password) => {
  try {
    const user = await createNewUserWithEmailAndPassword(
      userData.email,
      password
    );
    await addUserToDatabase({
      ...userData,
      id: user.uid,
      groups: [],
      defaultCurrency: "USD",
      friends: [],
      friendRequests: [],
      groupInvites: [],
      activities: [],
      profileImage: "",
      expenses: []
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
};

export const removeFriendRequestFromUser = async (user, friendID) => {
  const updatedUser = {
    ...user,
    friendRequests: user.friendRequests.filter(
      (request) => request !== friendID
    )
  };
  await addUserToDatabase(updatedUser);
  return updatedUser;
};

export const addGroupRequestToUser = async (user, groupID) => {
  if (user?.groupRequests?.includes(groupID)) {
    return;
  }

  await addUserToDatabase({
    ...user,
    groupRequests: [...user.groupRequests, groupID]
  });
};

export const removeGroupRequestFromUser = async (user, groupID) => {
  const updatedUser = {
    ...user,
    groupRequests: user.groupRequests.filter((request) => request !== groupID)
  };
  await addUserToDatabase(updatedUser);
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
};

export const removeFriendFromUser = async (user, friendID) => {
  await addUserToDatabase({
    ...user,
    friends: user.friends.filter((friend) => friend !== friendID)
  });
};

export const addExpenseToUser = async (user, expenseID) => {
  await addUserToDatabase({
    ...user,
    expenses: [...user.expenses, expenseID]
  });
};

export const addGroupToUser = async (user, groupID) => {
  await addUserToDatabase({ ...user, groups: [...user.groups, groupID] });
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

export const getAllUserExpensesIDsAndAddThemToTheUser = async (user) => {
  const expensesList = await getExpensesFromDatabase();

  console.log(
    expensesList
      .filter((expense) => expense.users.includes(user.id))
      .map((expense) => expense.id)
  );

  addUserToDatabase({
    ...user,
    expenses: expensesList
      .filter((expense) => expense.users.includes(user.id))
      .map((expense) => expense.id)
  });
};
