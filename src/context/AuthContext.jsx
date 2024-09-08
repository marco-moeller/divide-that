import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromDatabase } from "../database/user";
import { getProfileImage } from "../API/profileImageAPI";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../database/firebase";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initializeUser = async (user) => {
    if (user) {
      const userFromDatabase = await getUserFromDatabase(user.uid);
      setUser({ ...userFromDatabase });
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      initializeUser(user)
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    const getImgUrl = async () => {
      const url = await getProfileImage(user.profileImage);
      setProfileImgUrl(url);
    };
    getImgUrl();
  }, [user]);

  useEffect(() => {
    const handleUserUpdate = async () => {
      initializeUser(auth.currentUser);
    };

    window.addEventListener("userUpdate", handleUserUpdate);
    return () => window.removeEventListener("userUpdate", handleUserUpdate);
  }, []);

  const value = { user, isLoggedIn, isLoading, profileImgUrl };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
