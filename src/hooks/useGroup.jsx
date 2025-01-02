import { useEffect, useState } from "react";
import { database } from "../database/firebase";
import { doc, onSnapshot } from "firebase/firestore";

function useGroup(groupID) {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    if (!groupID) {
      return;
    }

    const groupRef = doc(database, "groups", groupID);

    const unsubscribe = onSnapshot(groupRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setGroup(docSnapshot.data());
      }
    });

    return unsubscribe;
  }, [groupID]);

  return { group };
}

export default useGroup;
