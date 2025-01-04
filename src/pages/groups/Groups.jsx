import { FaPlus } from "react-icons/fa";
import {
  activityTypes,
  getNewActivity,
  getNewGroup
} from "../../utility/interfaces";
import { useAuth } from "../../context/AuthContext";
import { addNewGroupToDatabase } from "../../API/groupsAPI";
import GroupListComponent from "../../components/groups/GroupListComponent";
import { nanoid } from "nanoid";
import GroupRequest from "../../components/groups/GroupRequest";
import GroupTotalDebtComponent from "../../components/groups/GroupTotalDebtComponent";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";

function Groups() {
  const { user } = useAuth();

  const handleAddNewGroup = async () => {
    try {
      const newGroup = getNewGroup(user.id);

      await addNewGroupToDatabase(newGroup, user);
      await handleNewActivity(newGroup);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewActivity = async (newGroup) => {
    const newActivity = getNewActivity({
      users: [user],
      type: activityTypes.createdGroup,
      groupName: newGroup.name,
      groupID: newGroup.id
    });
    addNewActivityToDatabase(newActivity);
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
