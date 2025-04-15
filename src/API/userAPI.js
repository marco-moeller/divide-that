import {
  createNewUserWithEmailAndPassword,
  deleteUserFromAuth,
  logoutUser,
  updateUserEmail,
  updateUserPassword
} from "../database/auth";
import { getExpensesFromDatabase } from "../database/expenses";
import {
  addGroupToDatabase,
  deleteGroupFromDatabase,
  getGroupFromDatabase
} from "../database/groups";
import { deleteImageFromDatabase } from "../database/profileImages";
import {
  addUserToDatabase,
  getAllUsersFromDatabase,
  getUserFromDatabase
} from "../database/user";

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
      expenses: [],
      blockedUsers: [],
      profileImgIsApproved: true
    });
  } catch (error) {
    console.log(error);
  }
};

export const acceptFriendRequest = async (userID, friendID) => {
  const user = await getUserFromDatabase(userID);
  const friend = await getUserFromDatabase(friendID);

  const updatedUser = {
    ...user,
    friendRequests: user.friendRequests.filter(
      (request) => request !== friendID
    )
  };
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

const addFriendToUser = async (user, friendID) => {
  if (user.friends.some((friend) => friend.id === friendID)) {
    return;
  }
  await addUserToDatabase({
    ...user,
    friends: [
      ...user.friends,
      { id: friendID, latestInteraction: JSON.stringify(new Date()) }
    ]
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

export const removeFriendFromUser = async (user, friendID) => {
  const userFromDatabase = await getUserFromDatabase(user.id);
  await addUserToDatabase({
    ...userFromDatabase,
    friends: userFromDatabase.friends.filter((friend) => friend.id !== friendID)
  });
};

export const updateLatestFriendInteraction = async (userID, user2ID) => {
  const user = await getUserFromDatabase(userID);
  const user2 = await getUserFromDatabase(user2ID);

  const updatedUser = {
    ...user,
    friends: user.friends.map((friend) =>
      friend.id === user2.id
        ? { ...friend, latestInteraction: JSON.stringify(new Date()) }
        : friend
    )
  };
  await addUserToDatabase(updatedUser);
  const updatedUser2 = {
    ...user2,
    friends: user2.friends.map((friend) =>
      friend.id === user.id
        ? { ...friend, latestInteraction: JSON.stringify(new Date()) }
        : friend
    )
  };
  await addUserToDatabase(updatedUser2);
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
    const user = await getUserFromDatabase(userID);

    //remove user from all friends
    await Promise.all(
      user.friends.map(async (friendObject) => {
        const friend = await getUserFromDatabase(friendObject.id);
        await addUserToDatabase({
          ...friend,
          friends: friend.friends.filter(
            (friendObject) => friendObject.id !== userID
          )
        });
      })
    );

    //delete all pending friend request
    const allUsers = await getAllUsersFromDatabase();
    await Promise.all(
      allUsers.map(async (user) => {
        if (user.friendRequests.includes(userID)) {
          await addUserToDatabase({
            ...user,
            friendRequests: user.friendRequests.filter(
              (friendID) => friendID !== user.id
            )
          });
        }
      })
    );

    //transfer group ownerships
    await Promise.all(
      user.groups.map(async (groupID) => {
        const group = await getGroupFromDatabase(groupID);
        if (group.users.length === 1) {
          deleteGroupFromDatabase(groupID);
        } else if (group.creator === user.id) {
          addGroupToDatabase({
            ...group,
            creator: group.users.filter((memberID) => memberID !== user.id)[0]
          });
        }
      })
    );

    //for everything else just turn the user into an deleted account
    addUserToDatabase({
      email: "deleted@email.com",
      userName: "Deleted User",
      id: user.id,
      groups: [],
      defaultCurrency: "USD",
      friends: [],
      friendRequests: [],
      groupInvites: [],
      activities: [],
      profileImage: "",
      expenses: []
    });

    if (profileImage !== "") {
      deleteImageFromDatabase("profileImages/" + profileImage);
    }
    await deleteUserFromAuth();
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

export const removeExpenseFromUser = async (user, expenseID) => {
  const updatedUser = {
    ...user,
    expenses: user.expenses.filter((expense) => expense.id !== expenseID)
  };
  await addUserToDatabase(updatedUser);
};

export const blockUser = async (userID, userToBeBlockedID) => {
  const user = await getUserFromDatabase(userID);
  await addUserToDatabase({
    ...user,
    blockedUsers: [...user.blockedUsers, userToBeBlockedID]
  });
};
