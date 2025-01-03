import { getExpenseFromDatabase } from "../database/expenses";
import { addGroupToDatabase } from "../database/groups";
import { addUserToDatabase, getUserFromDatabase } from "../database/user";
import { addGroupToUser } from "./userAPI";

export const addNewGroupToDatabase = async (group, user) => {
  try {
    await addGroupToDatabase(group);
    await addGroupToUser(user, group.id);
  } catch (error) {
    console.log(error);
  }
};

export const addUserToGroup = async (user, group) => {
  try {
    await addGroupToDatabase({
      ...group,
      users: [...group.users, user.id]
    });

    await addUserToDatabase({
      ...user,
      groups: [...user.groups, group.id],
      groupRequests: user.groupRequests.filter(
        (request) => request !== group.id
      )
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeUserFromGroup = async (group, user) => {
  try {
    await addGroupToDatabase({
      ...group,
      users: group.user.filter((userID) => userID !== user.id)
    });
    await addUserToDatabase({
      ...user,
      groups: user.groups.filter((groupID) => groupID !== group.id)
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroupUsers = async (groupUsers) => {
  try {
    const userList = await Promise.all(
      groupUsers.map(async (userID) => {
        const user = await getUserFromDatabase(userID);
        return user;
      })
    );
    return userList;
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroupExpenses = async (groupExpenses) => {
  try {
    const expensesList = await Promise.all(
      groupExpenses.map(async (expenseID) => {
        const expense = await getExpenseFromDatabase(expenseID);
        return expense;
      })
    );
    return expensesList;
  } catch (error) {}
};

export const deleteExpenseFromGroup = async (group, expenseID) => {
  try {
    const groupWithoutExpense = {
      ...group,
      expenses: group.expenses.filter((expense) => expense !== expenseID)
    };
    await addGroupToDatabase(groupWithoutExpense);
  } catch (error) {
    console.log(error);
  }
};
