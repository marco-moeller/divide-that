import { useEffect, useState } from "react";
import { getUserFromDatabase } from "../database/user";

function useUsers({ arrayOfUserIDs }) {
  const [userList, setUserList] = useState;

  useEffect(() => {
    const getUserListByID = async () => {
      try {
        const userPromises = arrayOfUserIDs.map(async (id) => {
          return await getUserFromDatabase(id);
        });
        const users = await Promise.all(userPromises);
        setUserList(users.filter((user) => user !== null));
      } catch (error) {
        console.log(error);
      }
    };

    getUserListByID();
  }, []);

  return { userList };
}

export default useUsers;
