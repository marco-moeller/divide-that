import { useEffect, useState } from "react";
import useGroupExpenses from "./useGroupExpenses";
import { useAuth } from "../context/AuthContext";
import { userHasPaid } from "../utility/expenseDisplay";
import { convertCurrency, getCurrencySymbolFromIcon } from "../utility/money";
import useCurrencyRates from "./useCurrencyRates";

function useTotalGroupDebtFromAllMembersInDefaultCurrency(group) {
  const [
    totalGroupDebtFromAllMembersInDefaultCurrency,
    setTotalGroupDebtFromAllMembersInDefaultCurrency
  ] = useState({ owes: 0, owed: 0 });
  const { conversionRates } = useCurrencyRates();

  const { expenses } = useGroupExpenses(group?.expenses);
  const { user } = useAuth();

  const getTotalDebt = (member) => {
    return expenses
      .filter(
        (expense) =>
          !expense.paidBy.includes(member) &&
          Object.keys(expense.split).includes(user.id) &&
          Object.keys(expense.split).includes(member)
      )
      .reduce((total, current) => {
        if (!total[current.currency]) {
          total[current.currency] = 0;
        }
        if (userHasPaid(user.id, current.sucker)) {
          total[current.currency] += current.amount * current.split[member];
        } else if (userHasPaid(member, current.sucker)) {
          total[current.currency] -= current.amount * current.split[user.id];
        }
        return total;
      }, {});
  };

  const getTotalDebtInDefaultCurrency = (member) => {
    if (member === user.id) return 0;

    const totalDebt = getTotalDebt(member);

    return Object.keys(totalDebt)
      .reduce(
        (total, current) =>
          total +
          convertCurrency(
            conversionRates,
            totalDebt[current],
            getCurrencySymbolFromIcon(current),
            user.defaultCurrency
          ),
        0
      )
      .toFixed(2);
  };

  useEffect(() => {
    if (!group || !conversionRates || !user || !expenses) {
      return;
    }

    const memberDebts = group?.users.map((member) =>
      Number(getTotalDebtInDefaultCurrency(member))
    );

    setTotalGroupDebtFromAllMembersInDefaultCurrency(
      memberDebts.reduce(
        (acc, current) => {
          current > 0 ? (acc.owed += current) : (acc.owes += current);
          return acc;
        },
        { owes: 0, owed: 0 }
      )
    );
  }, [group, conversionRates, expenses, user]);

  return { totalGroupDebtFromAllMembersInDefaultCurrency };
}

export default useTotalGroupDebtFromAllMembersInDefaultCurrency;
