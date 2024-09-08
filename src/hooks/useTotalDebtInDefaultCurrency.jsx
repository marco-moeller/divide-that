import { useAuth } from "../context/AuthContext";
import { getCurrencySymbolFromIcon } from "../utility/money";
import useCurrencyRates from "./useCurrencyRates";
import useExpensesList from "./useExpensesList";
import useTotalDebt from "./useTotalDebt";

function useTotalDebtInDefaultCurrency(friendID) {
  const expensesList = useExpensesList(friendID);
  const totalDebt = useTotalDebt(friendID, expensesList);

  const exchangeRates = useCurrencyRates();
  const { user } = useAuth();

  const getTotalDebtInDefaultCurrency = () => {
    if (!totalDebt) return;

    if (Object.keys(totalDebt).length === 0) return 0;
    return Object.keys(totalDebt).reduce(
      (total, current) =>
        total +
        convertCurrency(
          totalDebt[current],
          getCurrencySymbolFromIcon(current),
          user.defaultCurrency
        ),
      0
    );
  };

  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (!exchangeRates) return;

    const fromRate = exchangeRates.find(
      (rate) => rate.name === fromCurrency
    )?.amount;
    const toRate = exchangeRates.find(
      (rate) => rate.name === toCurrency
    )?.amount;

    if (fromRate && toRate) {
      const amountInTarget = amount / fromRate;
      const convertedAmount = amountInTarget * toRate;
      return convertedAmount;
    } else {
      console.error("Invalid currency");
      return null;
    }
  }

  return getTotalDebtInDefaultCurrency()?.toFixed(2);
}

export default useTotalDebtInDefaultCurrency;
