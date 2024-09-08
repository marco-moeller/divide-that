import { deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { database, expensesRef } from "./firebase";

export const addExpenseToDatabase = async (expense) => {
  try {
    await setDoc(doc(expensesRef, expense.id), expense);
  } catch (error) {
    console.log(error);
  }
};

export const getExpenseFromDatabase = async (expenseID) => {
  try {
    const expenseRef = doc(database, "expenses", expenseID);
    const snapshot = await getDoc(expenseRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data();
  } catch (error) {
    console.log(error);
  }
};

export const getExpensesFromDatabase = async () => {
  try {
    let expensesList = [];
    const snapshot = await getDocs(expensesRef);
    snapshot.docs.forEach((doc) => expensesList.push(doc.data()));
    return expensesList;
  } catch (error) {
    console.log(error);
  }
};

export const deleteExpenseFromDatabase = async (expenseID) => {
  try {
    await deleteDoc(doc(database, "expenses", expenseID));
  } catch (error) {
    console.log(error);
  }
};
