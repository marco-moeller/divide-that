import { useEffect, useState } from "react";
import { getConversionRatesFromDatabase } from "../database/conversionRates";

function useCurrencyRates() {
  const [conversionRates, setConversionRates] = useState(null);

  useEffect(() => {
    const getRates = async () => {
      try {
        setConversionRates(await getConversionRatesFromDatabase());
      } catch (error) {
        console.log(error);
        setConversionRates(null);
      }
    };

    getRates();
  }, []);

  return { conversionRates };
}

export default useCurrencyRates;
