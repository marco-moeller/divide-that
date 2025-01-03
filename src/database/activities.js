import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { database, activitiesRef } from "./firebase";

export const addActivityToDatabase = async (activity) => {
  try {
    await setDoc(doc(activitiesRef, activity.id), activity);
  } catch (error) {
    console.log(error);
  }
};

export const getActivityFromDatabase = async (activityID) => {
  try {
    const activityRef = doc(database, "activities", activityID);
    const snapshot = await getDoc(activityRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data();
  } catch (error) {
    console.log(error);
  }
};

export const deleteActivityFromDatabase = async (activityID) => {
  try {
    await deleteDoc(doc(database, "activities", activityID));
  } catch (error) {
    console.log(error);
  }
};
