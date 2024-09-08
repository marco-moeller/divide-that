import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userHasPaid } from "../utility/expenseDisplay";

function useTotalDebt(friendID, expensesList) {
  const [totalDebt, setTotalDebt] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const getTotalDebt = () => {
      setTotalDebt(
        expensesList
          .filter(
            (expense) =>
              expense.users.includes(friendID) ||
              expense.users.includes(user.id)
          )
          .reduce((total, current) => {
            if (!total[current.currency]) {
              total[current.currency] = 0;
            }
            if (userHasPaid(user.id, current.sucker)) {
              total[current.currency] += current.amount * (1 - current.split);
            } else {
              total[current.currency] -= current.amount * (1 - current.split);
            }
            return total;
          }, {})
      );
    };

    getTotalDebt();
  }, [user, expensesList]);

  return totalDebt;
}

export default useTotalDebt;
