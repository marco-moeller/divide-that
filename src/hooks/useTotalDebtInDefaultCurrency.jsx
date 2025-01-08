import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { convertCurrency, getCurrencySymbolFromIcon } from "../utility/money";
import useCurrencyRates from "./useCurrencyRates";
import useFriendExpenses from "./useFriendExpenses";
import useTotalDebt from "./useTotalDebt";

function useTotalDebtInDefaultCurrency(friendID) {
  const { expenses } = useFriendExpenses(friendID);
  const totalDebt = useTotalDebt(friendID, expenses);

  const { conversionRates } = useCurrencyRates();
  const { user } = useAuth();

  const [totalDebtInDefaultCurrency, setTotalGroupDebtInDefaultCurrency] =
    useState(0);

  useEffect(() => {
    if (!totalDebt || !user || !conversionRates) return;

    const getTotalDebtInDefaultCurrency = () => {
      if (Object.keys(totalDebt).length === 0)
        return setTotalGroupDebtInDefaultCurrency(0);
      else
        setTotalGroupDebtInDefaultCurrency(
          Object.keys(totalDebt)
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
            .toFixed(2)
        );
    };

    getTotalDebtInDefaultCurrency();
  }, [totalDebt, user, conversionRates]);

  return { totalDebtInDefaultCurrency };
}

export default useTotalDebtInDefaultCurrency;
