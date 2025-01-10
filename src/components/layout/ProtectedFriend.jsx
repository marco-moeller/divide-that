import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedFriend() {
  const { user } = useAuth();
  const { id } = useParams();

  if (!user) return <></>;

  return user.friends.some((friend) => friend.id === id) ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}

export default ProtectedFriend;
