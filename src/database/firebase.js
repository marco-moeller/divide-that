import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const auth = getAuth(app);

export const expensesRef = collection(database, "expenses");
export const usersRef = collection(database, "users");
export const conversionRatesRef = collection(database, "conversionRates");
export const groupsRef = collection(database, "groups");
export const activitiesRef = collection(database, "activities");

/* -- STORAGE -- */
export const imageDB = getStorage(app);
