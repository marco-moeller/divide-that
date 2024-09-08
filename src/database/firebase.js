import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1eJtospuHWuAAqNhoBmC65kRgZIvp27c",
  authDomain: "splitwiser-2f5e9.firebaseapp.com",
  projectId: "splitwiser-2f5e9",
  storageBucket: "splitwiser-2f5e9.appspot.com",
  messagingSenderId: "502467777477",
  appId: "1:502467777477:web:a94254eae20a5a1cbe31ac"
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const auth = getAuth(app);

export const expensesRef = collection(database, "expenses");
export const usersRef = collection(database, "users");
export const conversionRatesRef = collection(database, "conversionRates");

/* -- STORAGE -- */
export const imageDB = getStorage(app);
