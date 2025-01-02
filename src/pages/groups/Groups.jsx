import { FaPlus } from "react-icons/fa";
import { getNewGroup } from "../../utility/interfaces";
import { useAuth } from "../../context/AuthContext";
import { addNewGroupToDatabase } from "../../API/groupsAPI";
import GroupListComponent from "../../components/groups/GroupListComponent";
import { nanoid } from "nanoid";
import GroupRequest from "../../components/groups/GroupRequest";
import GroupTotalDebtComponent from "../../components/groups/GroupTotalDebtComponent";

function Groups() {
  const { user } = useAuth();

  const handleAddNewGroup = async () => {
    const newGroup = getNewGroup(user.id);

    await addNewGroupToDatabase(newGroup, user);
  };

  if (!user) return <main></main>;

  return (
    <main className="groups">
      <h2 className="title">Your Groups</h2>
      <ul className="groups-list">
        {user?.groups.map((groupId) => {
          return (
            <div key={groupId}>
              <GroupListComponent groupID={groupId} key={nanoid()} />
              <GroupTotalDebtComponent groupID={groupId} />
            </div>
          );
        })}
        <button className="add-group-btn" onClick={handleAddNewGroup}>
          <FaPlus />
        </button>
        <p>create a new group</p>
      </ul>
      <ul className="group-req">
        {user?.groupRequests?.map((request) => (
          <GroupRequest key={nanoid()} request={request} />
        ))}
      </ul>
    </main>
  );
}

export default Groups;
