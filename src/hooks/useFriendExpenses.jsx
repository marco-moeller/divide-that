import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { database } from "../database/firebase";
import { useAuth } from "../context/AuthContext";

function useFriendExpenses(friendID) {
  const [expenses, setExpenses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user?.expenses || user.expenses.length === 0) return;

    const unsubscribes = user.expenses.map((id) => {
      const expensesRef = doc(database, "expenses", id);

      return onSnapshot(expensesRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setExpenses((prevExpenses) => {
            const updated = prevExpenses.filter((expense) => expense.id !== id);

            return [...updated, { ...docSnapshot.data() }]
              .filter(
                (expense) =>
                  expense.users.includes(friendID) && !expense.settled
              )
              .sort((a, b) => b.date - a.date);
          });
        }
      });
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [user]);

  return { expenses };
}

export default useFriendExpenses;
