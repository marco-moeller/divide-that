import { useEffect, useState } from "react";
import { getAllGroupUsers } from "../API/groupsAPI";

function useGroupMembers(groupUsers) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const getAllMembers = async () =>
      setMembers(await getAllGroupUsers(groupUsers));

    getAllMembers();
  }, [groupUsers]);

  return { members };
}

export default useGroupMembers;
