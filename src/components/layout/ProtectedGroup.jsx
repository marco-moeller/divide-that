import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedGroup() {
  const { user } = useAuth();
  const { id } = useParams();

  if (!user) return <></>;

  return user.groups.includes(id) ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedGroup;
