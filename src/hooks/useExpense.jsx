import { useEffect, useState } from "react";
import { getExpenseFromDatabase } from "../database/expenses";

function useExpense(expenseID) {
  const [expense, setExpense] = useState(null);

  const refreshExpense = async () => {
    setExpense(await getExpenseFromDatabase(expenseID));
  };

  useEffect(() => {
    const getExpense = async () => {
      setExpense(await getExpenseFromDatabase(expenseID));
    };

    getExpense();
  }, []);

  return { expense, refreshExpense };
}

export default useExpense;
