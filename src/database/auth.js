import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword
} from "firebase/auth";
import { auth } from "./firebase";

export const createNewUserWithEmailAndPassword = async (email, password) => {
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredentials.user;
};

export const loginUser = async (userData) => {
  try {
    await signInWithEmailAndPassword(auth, userData.email, userData.password);
    return null;
  } catch (error) {
    return error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const updateUserPassword = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const sendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`
  });
};

export const updateUserEmail = async (email) => {
  try {
    await updateEmail(auth.currentUser, email);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserFromAuth = async () => {
  try {
    await deleteUser(auth.currentUser);
  } catch (error) {
    console.log(error);
  }
};
