import { useEffect, useState } from "react";
import useCurrencyRates from "./useCurrencyRates";
import { convertCurrency, getCurrencySymbolFromIcon } from "../utility/money";
import { useAuth } from "../context/AuthContext";

function useTotalGroupDebtInDefaultCurrency(totalDebt) {
  const [totalGroupDebtInDefaultCurrency, setTotalGroupDebtInDefaultCurrency] =
    useState(0);
  const { conversionRates } = useCurrencyRates();
  const { user } = useAuth();

  useEffect(() => {
    if (!totalDebt || !user || !conversionRates) return;
    if (Object.keys(totalDebt).length === 0)
      setTotalGroupDebtInDefaultCurrency(0);

    const getTotalDebtInDefaultCurrency = () => {
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
  }, [totalDebt, conversionRates, user]);

  return { totalGroupDebtInDefaultCurrency };
}

export default useTotalGroupDebtInDefaultCurrency;
