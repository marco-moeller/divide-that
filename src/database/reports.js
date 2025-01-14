import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { database, reportsRef } from "./firebase";

export const addReportToDatabase = async (report) => {
  try {
    await setDoc(doc(reportsRef, report.id), report);
  } catch (error) {
    console.log(error);
  }
};

export const getReportFromDatabase = async (reportID) => {
  try {
    const reportRef = doc(database, "reports", reportID);
    const snapshot = await getDoc(reportRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data();
  } catch (error) {
    console.log(error);
  }
};

export const deleteReportFromDatabase = async (reportID) => {
  try {
    await deleteDoc(doc(database, "reports", reportID));
  } catch (error) {
    console.log(error);
  }
};
