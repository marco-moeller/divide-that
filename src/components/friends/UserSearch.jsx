import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { addFriendRequestToFriend } from "../../API/userAPI";
import { getAllUsersFromDatabase } from "../../database/user";
import { usePopup } from "../../context/PopupContext";
import { IoMdArrowRoundDown } from "react-icons/io";
import ErrorComponent from "../error/ErrorComponent";
import SubmitButton from "../layout/SubmitButton";

function UserSearch() {
  const { user } = useAuth();
  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [error, setError] = useState(null);
  const [isHidden, setIsHidden] = useState(false);

  const { showPopup } = usePopup();

  const sendFriendRequest = async () => {
    try {
      if (!selectedUser) throw new Error("No user selected.");
      if (selectedUser.friendRequests.includes(user.id))
        throw new Error(
          `You already invited ${selectedUser.userName} to be your friend.`
        );

      await addFriendRequestToFriend(selectedUser, user);

      showPopup("Friend Request Sent");
      setSelectedUser(null);
      setCurrentSearch("");
      setError(null);
      setAllUsers(await getAllUsersFromDatabase());
    } catch (error) {
      setError(error.message);
    }
  };

  const hideDropdown = () => {
    setIsHidden(true);
  };

  const showDropdown = () => {
    setIsHidden(false);
  };

  const renderDropdown = () => {
    const userExistsAndINotFriendOrSelf = (userFromAllUsers) => {
      return (
        isSubstringOf(
          userFromAllUsers.userName.toLowerCase(),
          currentSearch.toLowerCase()
        ) &&
        userFromAllUsers.userName !== user.userName &&
        !user.friends.some((friend) => friend.id === userFromAllUsers.id)
      );
    };

    const emailExistsAndINotFriendOrSelf = (userFromAllUsers) => {
      return (
        isSubstringOf(
          userFromAllUsers.email.toLowerCase(),
          currentSearch.toLowerCase()
        ) &&
        userFromAllUsers.userName !== user.userName &&
        !user.friends.some((friend) => friend.id === userFromAllUsers.id)
      );
    };

    const userHasBeenBlocked = (userFromAllUsers) => {
      return user.blockedUsers.includes(userFromAllUsers?.id);
    };

    const hasRequestFromUserAlready = (userFromAllUsers) => {
      return userFromAllUsers.friendRequests.includes(user.id);
    };

    if (!allUsers) return;

    if (
      allUsers?.filter(
        (userFromAllUsers) =>
          (userExistsAndINotFriendOrSelf(userFromAllUsers) ||
            emailExistsAndINotFriendOrSelf(userFromAllUsers)) &&
          !hasRequestFromUserAlready(userFromAllUsers) &&
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
              (userExistsAndINotFriendOrSelf(userFromAllUsers) ||
                emailExistsAndINotFriendOrSelf(userFromAllUsers)) &&
              !hasRequestFromUserAlready(userFromAllUsers) &&
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
        Find your <span className="red">&nbsp;friends&nbsp; </span> below{" "}
        <IoMdArrowRoundDown />
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
        className="add-friend-btn btn"
        disabled={!selectedUser}
        onClick={sendFriendRequest}
      >
        send friend request
      </SubmitButton>
      <ErrorComponent>{error}</ErrorComponent>
    </div>
  );
}

export default UserSearch;
