import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userHasPaid } from "../utility/expenseDisplay";

function useTotalGroupDebt(debtorID, expensesList) {
  const [totalDebt, setTotalDebt] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (expensesList.length === 0) setTotalDebt(0);

    const getTotalDebt = () => {
      setTotalDebt(
        expensesList
          .filter(
            (expense) =>
              !expense.paidBy.includes(debtorID) &&
              !expense.paidBy.includes(user.id) &&
              Object.keys(expense.split).includes(user.id) &&
              Object.keys(expense.split).includes(debtorID)
          )
          .reduce((total, current) => {
            if (!total[current.currency]) {
              total[current.currency] = 0;
            }
            if (userHasPaid(user.id, current.sucker)) {
              total[current.currency] +=
                current.amount * current.split[debtorID];
            } else if (userHasPaid(debtorID, current.sucker)) {
              total[current.currency] -=
                current.amount * current.split[user.id];
            }
            return total;
          }, {})
      );
    };

    getTotalDebt();
  }, [user, expensesList, debtorID]);

  return { totalDebt };
}

export default useTotalGroupDebt;
