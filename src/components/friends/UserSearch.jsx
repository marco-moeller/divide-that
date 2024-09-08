import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { nanoid } from "nanoid";
import { addFriendRequestToFriend } from "../../API/userAPI";
import { getAllUsersFromDatabase } from "../../database/user";

function UserSearch() {
  const { user } = useAuth();
  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const sendFriendRequest = async () => {
    if (status === "submitting") return;

    try {
      setStatus("submitting");
      if (!selectedUser) throw new Error("No user selected.");
      if (selectedUser.friendRequests.includes(user.id))
        throw new Error(
          `You already invited ${selectedUser.userName} to be your friend.`
        );

      await addFriendRequestToFriend(selectedUser, user);
      setSelectedUser(null);
      setCurrentSearch("");
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setStatus("idle");
    }
  };

  const renderDropdown = () => {
    if (!allUsers) return;

    return (
      <div className="dropdown">
        {allUsers
          ?.filter(
            (userFromAllUsers) =>
              isSubstringOf(userFromAllUsers.userName, currentSearch) &&
              userFromAllUsers.userName !== user.userName &&
              !user.friends.includes(userFromAllUsers.id)
          )
          .map((userFromAllUsers) => (
            <div className="search-list" key={nanoid}>
              <img
                src={userFromAllUsers.profileImgUrl}
                alt=""
                className="profile-pic-small"
              />
              <p
                key={nanoid()}
                className="dropdown-elem"
                onClick={() => {
                  setSelectedUser(userFromAllUsers);
                  setCurrentSearch(userFromAllUsers.userName);
                }}
              >
                {userFromAllUsers.userName}
              </p>
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
    if (currentSearch === "") return;

    if (allUsers && allUsers.length > 0) return;

    const getUsers = async () => {
      setAllUsers(await getAllUsersFromDatabase());
    };

    getUsers();
  }, [currentSearch]);

  return (
    <div className="search-users">
      <input
        className="search"
        type="text"
        placeholder="search by username..."
        value={currentSearch}
        onChange={handleChange}
      />
      {currentSearch && renderDropdown()}
      <button
        className="add-friend-btn"
        disabled={status === "submitting"}
        onClick={sendFriendRequest}
      >
        send friend request
      </button>
      <p>{error?.message}</p>
    </div>
  );
}

export default UserSearch;
