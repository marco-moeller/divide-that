import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { database } from "../database/firebase";

function useGroupExpenses(groupExpenses) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!groupExpenses || groupExpenses.length === 0) return;

    const unsubscribes = groupExpenses.map((id) => {
      const expensesRef = doc(database, "expenses", id);

      return onSnapshot(expensesRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setExpenses((prevExpenses) => {
            const updated = prevExpenses.filter((expense) => expense.id !== id);

            return [...updated, { ...docSnapshot.data() }].sort(
              (a, b) => b.date - a.date
            );
          });
        }
      });
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [groupExpenses]);

  return { expenses };
}

export default useGroupExpenses;
