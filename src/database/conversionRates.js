import { getDocs } from "firebase/firestore";
import { conversionRatesRef } from "./firebase";

export const getConversionRatesFromDatabase = async () => {
  try {
    let conversionRatesList = [];
    const snapshot = await getDocs(conversionRatesRef);
    snapshot.docs.forEach((doc) => conversionRatesList.push(doc.data()));
    return conversionRatesList;
  } catch (error) {
    console.log(error);
    return null;
  }
};
