import { FaPlus } from "react-icons/fa";
import {
  activityTypes,
  getNewActivity,
  getNewGroup
} from "../../utility/interfaces";
import { useAuth } from "../../context/AuthContext";
import { addNewGroupToDatabase } from "../../API/groupsAPI";
import GroupListComponent from "../../components/groups/GroupListComponent";
import GroupRequest from "../../components/groups/GroupRequest";
import GroupTotalDebtComponent from "../../components/groups/GroupTotalDebtComponent";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";
import ErrorComponent from "../../components/error/ErrorComponent";
import useError from "../../components/error/useError";

function Groups() {
  const { user } = useAuth();
  const { error, setError } = useError();

  const handleAddNewGroup = async () => {
    try {
      if (user.groups.length >= 20)
        throw new Error("You can't be in more than 20 groups");

      const newGroup = getNewGroup(user.id);

      await addNewGroupToDatabase(newGroup, user);
      await handleNewActivity(newGroup);
      setError(null);
    } catch (error) {
      setError(error.message);
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
      <ErrorComponent>{error}</ErrorComponent>
      <ul className="groups-list">
        {user?.groups.map((groupId) => {
          return (
            <div key={groupId}>
              <GroupListComponent groupID={groupId} key={groupId} />
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
          <GroupRequest key={request} request={request} />
        ))}
      </ul>
    </main>
  );
}

export default Groups;
