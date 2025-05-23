import { memo, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { addGroupRequestToUser } from "../../API/userAPI";
import { getAllUsersFromDatabase } from "../../database/user";
import { usePopup } from "../../context/PopupContext";
import { IoMdArrowRoundDown } from "react-icons/io";
import { activityTypes, getNewActivity } from "../../utility/interfaces";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";
import ErrorComponent from "../error/ErrorComponent";
import SubmitButton from "../layout/SubmitButton";

function GroupUserSearch({ group }) {
  const { user } = useAuth();

  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [error, setError] = useState(null);
  const [isHidden, setIsHidden] = useState(false);

  const { showPopup } = usePopup();

  const sendGroupInvite = async () => {
    try {
      if (!selectedUser) throw new Error("No user selected.");
      if (selectedUser.groupRequests.includes(group.id))
        throw new Error(
          `${selectedUser.userName} has already been invited to this group.`
        );

      await addGroupRequestToUser(selectedUser, group.id);
      await handleNewActivity();
      setAllUsers(await getAllUsersFromDatabase());
      showPopup("Group Invite Sent");
      setSelectedUser(null);
      setCurrentSearch("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [user, selectedUser],
      type: activityTypes.sentGroupInvite,
      groupName: group.name,
      groupID: group.id
    });
    addNewActivityToDatabase(newActivity);
  };

  const hideDropdown = () => {
    setIsHidden(true);
  };

  const showDropdown = () => {
    setIsHidden(false);
  };

  const renderDropdown = () => {
    const userExistsAndINotInGroupOrSelf = (userFromAllUsers) => {
      return (
        isSubstringOf(
          userFromAllUsers.userName.toLowerCase(),
          currentSearch.toLowerCase()
        ) &&
        userFromAllUsers.userName !== user.userName &&
        !group.users.includes(userFromAllUsers.id)
      );
    };

    const emailExistsAndINotInGroupOrSelf = (userFromAllUsers) => {
      return (
        isSubstringOf(
          userFromAllUsers.email.toLowerCase(),
          currentSearch.toLowerCase()
        ) &&
        userFromAllUsers.userName !== user.userName &&
        !group.users.includes(userFromAllUsers.id)
      );
    };

    const userHasBeenBlocked = (userFromAllUsers) => {
      return user.blockedUsers.includes(userFromAllUsers?.id);
    };

    const hasRequestFromThisGroupAlready = (userFromAllUsers) => {
      return userFromAllUsers.groupRequests.includes(group.id);
    };

    if (!allUsers) return;

    if (
      allUsers?.filter(
        (userFromAllUsers) =>
          (userExistsAndINotInGroupOrSelf(userFromAllUsers) ||
            emailExistsAndINotInGroupOrSelf(userFromAllUsers)) &&
          !hasRequestFromThisGroupAlready(userFromAllUsers) &&
          userFromAllUsers.userName !== "Deleted User" &&
          !userHasBeenBlocked(userFromAllUsers)
      ).length === 0
    )
      return;

    return (
      <div className="dropdown scrollable-y scrollable">
        {allUsers
          ?.filter(
            (userFromAllUsers) =>
              (userExistsAndINotInGroupOrSelf(userFromAllUsers) ||
                emailExistsAndINotInGroupOrSelf(userFromAllUsers)) &&
              !hasRequestFromThisGroupAlready(userFromAllUsers) &&
              userFromAllUsers.userName !== "Deleted User" &&
              !userHasBeenBlocked(userFromAllUsers)
          )
          .map((userFromAllUsers) => (
            <div
              className="search-list"
              key={userFromAllUsers.id}
              onClick={() => {
                setSelectedUser(userFromAllUsers);
                setCurrentSearch(userFromAllUsers.userName);
                hideDropdown();
              }}
            >
              <img
                src={userFromAllUsers.profileImgUrl}
                alt=""
                className="profile-pic-small"
              />
              <p className="dropdown-elem">{userFromAllUsers.userName}</p>
            </div>
          ))}
      </div>
    );
  };

  const handleChange = (event) => {
    setCurrentSearch(event.target.value);
  };

  const isSubstringOf = (string, substring) => {
    return string.includes(substring);
  };

  useEffect(() => {
    // if (currentSearch === "") return;

    if (allUsers && allUsers.length > 0) return;

    const getUsers = async () => {
      try {
        setAllUsers(await getAllUsersFromDatabase());
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [currentSearch]);

  return (
    <div className="search-users">
      <p className="find-your-friends-below">
        Invite people to this <span className="red">&nbsp;group&nbsp; </span>{" "}
        below <IoMdArrowRoundDown />
      </p>
      <input
        className="search"
        type="text"
        placeholder="search by username or email..."
        value={currentSearch}
        onChange={handleChange}
        onFocus={showDropdown}
      />
      {currentSearch && !isHidden && renderDropdown()}
      <SubmitButton
        className="add-group-member-btn btn"
        disabled={!selectedUser}
        onClick={sendGroupInvite}
      >
        send group invite
      </SubmitButton>
      <ErrorComponent>{error}</ErrorComponent>
    </div>
  );
}

export default memo(GroupUserSearch);
