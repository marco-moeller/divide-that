import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalHeader from "../modals/ModalHeader";
import GroupListComponent from "./GroupListComponent";
import { MdGroupOff, MdOutlineModeEdit } from "react-icons/md";
import {
  addGroupToDatabase,
  deleteGroupFromDatabase
} from "../../database/groups";
import { getAllGroupUsers } from "../../API/groupsAPI";
import { addUserToDatabase } from "../../database/user";
import { deleteExpenseFromDatabase } from "../../database/expenses";
import { useNavigate } from "react-router-dom";
import useError from "../error/useError";
import ErrorComponent from "../error/ErrorComponent";
import useVisibilityToggle from "../../hooks/useVisibilityToggle";
import { activityTypes, getNewActivity } from "../../utility/interfaces";
import useGroupMembers from "../../hooks/useGroupMembers";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";
import ModalBody from "../modals/ModalBody";
import SubmitButton from "../layout/SubmitButton";

function GroupSettingsModal({ toggle, group }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error, setError } = useError();

  const { members } = useGroupMembers(group?.users);
  const [groupName, setGroupName] = useState(group.name);

  const { isShowing, toggle: toggleDeleteConfirmButton } =
    useVisibilityToggle();

  const { isShowing: isShowingGroupName, toggle: toggleGroupName } =
    useVisibilityToggle();

  const handleDeleteClick = async () => {
    try {
      await deleteGroupFromDatabase(group.id);
      await handleNewDeleteActivity();

      const groupMembers = await getAllGroupUsers(group.users);
      groupMembers.forEach(
        async (member) =>
          await addUserToDatabase({
            ...member,
            groups: member.groups.filter((groupID) => groupID !== group.id)
          })
      );

      group.expenses.forEach(
        async (expenseID) => await deleteExpenseFromDatabase(expenseID)
      );
      toggle();
      setError(null);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setGroupName(value);
  };

  const handleSubmit = async () => {
    try {
      if (groupName.length > 15) {
        throw new Error("Group names can only have up to 15 characters!");
      }

      toggle();
      await addGroupToDatabase({ ...group, name: groupName });
      await handleNewActivity();
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [...members],
      type: activityTypes.updatedGroup,
      groupName: group.name,
      groupID: group.id
    });
    addNewActivityToDatabase(newActivity);
  };

  const handleNewDeleteActivity = async () => {
    const newActivity = getNewActivity({
      users: [...members],
      type: activityTypes.deletedGroup,
      groupName: group.name
    });
    addNewActivityToDatabase(newActivity);
  };

  useEffect(() => {
    if (user.id !== group.creator) {
      toggle();
    }
  }, [user, group]);

  if (!user || !members) {
    return;
  }

  return (
    <>
      <ModalHeader toggleModal={toggle} handleSubmit={handleSubmit}>
        Group Settings
      </ModalHeader>
      <ModalBody>
        <section className="group-settings fd-column flex">
          <GroupListComponent groupID={group.id} />
          <div className="divider"></div>

          <label htmlFor="group-name">Group Name</label>
          {!isShowingGroupName && (
            <h2 className="group-name" name="group-name">
              {groupName}
              <MdOutlineModeEdit onClick={toggleGroupName} />
            </h2>
          )}
          {isShowingGroupName && (
            <input
              name="groupName"
              id="groupName"
              onChange={handleChange}
              type="groupName"
              placeholder={groupName}
              value={groupName}
              autoComplete="on"
              maxLength={15}
            />
          )}
          <div className="group-settings-option">
            <MdGroupOff />
            <div onClick={toggleDeleteConfirmButton}>
              <p className="red">Delete {group.name}</p>
              <p className="subtitle">
                Delete this group and all its expenses. This action is final!
              </p>
            </div>
          </div>
          {isShowing && (
            <SubmitButton className="red btn" onClick={handleDeleteClick}>
              Confirm Delete Group
            </SubmitButton>
          )}
        </section>
        <ErrorComponent>{error}</ErrorComponent>
      </ModalBody>
    </>
  );
}

export default GroupSettingsModal;
