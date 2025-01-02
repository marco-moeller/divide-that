import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { database } from "../database/firebase";

function useExpense(expenseID) {
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    if (!expenseID) {
      return;
    }

    const expenseRef = doc(database, "expenses", expenseID);

    const unsubscribe = onSnapshot(expenseRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setExpense(docSnapshot.data());
      }
    });

    return unsubscribe;
  }, [expenseID]);

  return { expense };
}

export default useExpense;
