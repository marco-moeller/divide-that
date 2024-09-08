import { useEffect, useState } from "react";
import { getConversionRatesFromDatabase } from "../database/conversionRates";

function useCurrencyRates() {
  const [conversionRates, setConversionRates] = useState(null);

  useEffect(() => {
    const getRates = async () => {
      setConversionRates(await getConversionRatesFromDatabase());
    };

    getRates();
  }, []);

  return conversionRates;
}

export default useCurrencyRates;
