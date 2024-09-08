import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Protected({}) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default Protected;
