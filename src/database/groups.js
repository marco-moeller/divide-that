import { deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { database, groupsRef } from "./firebase";

export const addGroupToDatabase = async (group) => {
  try {
    await setDoc(doc(groupsRef, group.id), group);
  } catch (error) {
    console.log(error);
  }
};

export const getGroupFromDatabase = async (groupID) => {
  try {
    const groupRef = doc(database, "groups", groupID);
    const snapshot = await getDoc(groupRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data();
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroupsFromDatabase = async () => {
  try {
    let groupsList = [];
    const snapshot = await getDocs(groupsRef);
    snapshot.docs.forEach(async (doc) => groupsList.push(doc.data()));
    return groupsList;
  } catch (error) {
    console.log(error);
  }
};

export const deleteGroupFromDatabase = async (groupID) => {
  try {
    await deleteDoc(doc(database, "groups", groupID));
  } catch (error) {
    console.log(error);
  }
};
