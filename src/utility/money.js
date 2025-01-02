import { currencies } from "../data/data";

export const addZeros = (amount) => {
  return Number.parseFloat(amount).toFixed(2);
};

export const getCurrencyIconFromSymbol = (symbol) => {
  const currency = currencies.find((curr) => curr.symbol === symbol);
  return currency ? currency.icon : null;
};

export const getCurrencySymbolFromIcon = (icon) => {
  const currency = currencies.find((curr) => curr.icon === icon);
  return currency ? currency.symbol : null;
};

export const getOwedAmountColor = (amount) => {
  return amount >= 0 ? "green" : "red";
};

export const getCurrencyName = (iconOrSymbol) => {
  const currency = currencies.find(
    (curr) => curr.symbol === iconOrSymbol || curr.icon === iconOrSymbol
  );
  return currency ? currency.name : null;
};

export const cutAfterTwoDecimals = (number) => Math.trunc(number * 100) / 100;

export const convertCurrency = (
  exchangeRates,
  amount,
  fromCurrency,
  toCurrency
) => {
  if (!exchangeRates) return;

  const fromRate = exchangeRates.find(
    (rate) => rate.name === fromCurrency
  )?.amount;
  const toRate = exchangeRates.find((rate) => rate.name === toCurrency)?.amount;

  if (fromRate && toRate) {
    const amountInTarget = amount / fromRate;
    const convertedAmount = amountInTarget * toRate;

    return convertedAmount;
  } else {
    console.error("Invalid currency");
    return null;
  }
};
