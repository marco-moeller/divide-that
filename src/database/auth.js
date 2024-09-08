import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword
} from "firebase/auth";
import { auth } from "./firebase";

export const createNewUserWithEmailAndPassword = async (userData) => {
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password
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
  return auth.signOut();
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
