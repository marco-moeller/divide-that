import { useEffect, useState } from "react";
import { getAllGroupUsers } from "../API/groupsAPI";

function useGroupMembers(groupUsers) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const getAllMembers = async () => {
      if (!groupUsers) return;
      try {
        setMembers(await getAllGroupUsers(groupUsers));
      } catch (error) {
        console.log(error);
        setMembers([]);
      }
    };
    getAllMembers();
  }, [groupUsers]);

  return { members };
}

export default useGroupMembers;
