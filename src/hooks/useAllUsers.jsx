import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { usersRef } from "../database/firebase";

function useAllUsers() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const allUsersList = snapshot.docs.map((doc) => doc.data());
        setAllUsers(allUsersList);
      },
      (error) => console.log(error)
    );

    return () => unsubscribe();
  }, []);

  return { allUsers };
}

export default useAllUsers;
