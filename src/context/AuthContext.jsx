import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromDatabase } from "../database/user";
import { getProfileImage } from "../API/profileImageAPI";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../database/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const initializeUser = async (user) => {
      if (user) {
        const userDocRef = doc(database, "users", user.uid);
        unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUser({ ...doc.data() });
          }
        });
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) =>
      initializeUser(user)
    );

    return () => {
      unsubscribe();
      unsubscribeSnapshot();
    };
  }, []);

  useEffect(() => {
    const getImgUrl = async () => {
      try {
        const url = await getProfileImage(user.profileImage);
        setProfileImgUrl(url);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getImgUrl();
    }
  }, [user]);

  const value = { user, isLoggedIn, isLoading, profileImgUrl };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
