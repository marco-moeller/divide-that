import FriendListComponent from "../../components/friends/FriendListComponent";
import { useAuth } from "../../context/AuthContext";
import FriendRequest from "../../components/friends/FriendsRequest";
import UserSearch from "../../components/friends/UserSearch";

function Friends() {
  const { user } = useAuth();

  if (!user) return <main></main>;

  return (
    <main className="friends">
      <h2 className="title">Your Friends</h2>
      {user?.friends.length === 0 && (
        <h3 className="no-friends">You have no friends yet</h3>
      )}
      <ul className="friends-list">
        {user?.friends
          .sort(
            (a, b) =>
              new Date(JSON.parse(b.latestInteraction)) -
              new Date(JSON.parse(a.latestInteraction))
          )
          .map((friend) => {
            return <FriendListComponent friendId={friend.id} key={friend.id} />;
          })}
      </ul>
      <UserSearch />
      <ul className="friend-req">
        {user?.friendRequests?.map((request) => (
          <FriendRequest key={request} request={request} />
        ))}
      </ul>
    </main>
  );
}

export default Friends;
