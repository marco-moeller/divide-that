import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { expensesRef } from "../database/firebase";
import { useAuth } from "../context/AuthContext";

function useExpensesList(friendID) {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    onSnapshot(expensesRef, (snapshot) => {
      let expensesList = [];
      snapshot.docs.forEach((doc) => expensesList.push(doc.data()));
      setExpensesList(
        expensesList
          .filter(
            (expense) =>
              !expense.settled &&
              (!expense?.group || expense?.group === "") &&
              expense.users.includes(user.id) &&
              expense.users.includes(friendID)
          )
          .sort((a, b) => b.date - a.date)
      );
    });
  }, [user]);

  return expensesList;
}

export default useExpensesList;
