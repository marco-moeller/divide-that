import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Protected({}) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <></>;
  if (isLoggedIn) return <Outlet />;
  if (!isLoggedIn) return <Navigate to="/home" />;
}

export default Protected;
