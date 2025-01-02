import { useAuth } from "../context/AuthContext";
import { convertCurrency, getCurrencySymbolFromIcon } from "../utility/money";
import useCurrencyRates from "./useCurrencyRates";
import useExpensesList from "./useExpensesList";
import useTotalDebt from "./useTotalDebt";

function useTotalDebtInDefaultCurrency(friendID) {
  const expensesList = useExpensesList(friendID);
  const totalDebt = useTotalDebt(friendID, expensesList);

  const { conversionRates } = useCurrencyRates();
  const { user } = useAuth();

  const getTotalDebtInDefaultCurrency = () => {
    if (!totalDebt) return;

    if (Object.keys(totalDebt).length === 0) return 0;
    return Object.keys(totalDebt).reduce(
      (total, current) =>
        total +
        convertCurrency(
          conversionRates,
          totalDebt[current],
          getCurrencySymbolFromIcon(current),
          user.defaultCurrency
        ),
      0
    );
  };

  return getTotalDebtInDefaultCurrency()?.toFixed(2);
}

export default useTotalDebtInDefaultCurrency;
