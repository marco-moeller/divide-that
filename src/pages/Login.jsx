import { useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../database/auth";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { isLoggedIn } = useAuth();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: ""
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (status !== "submitting") {
        setStatus("submitting");
        const loginResult = await loginUser(loginFormData);
        if (loginResult) {
          throw new Error(loginResult.message);
        }
        navigate("/");
      }
    } catch (error) {
      setError(error);
    } finally {
      setStatus("idle");
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <main className="login">
      {" "}
      <h1>Sign in to your account</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          autoComplete="on"
          value={loginFormData.email}
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          value={loginFormData.password}
          autoComplete="on"
        />
        <button disabled={status === "submitting"}>Log in</button>
        <p>{error?.message}</p>
      </form>
      <p>
        {"No Account yet? "}
        <NavLink to="/register" className="green">
          Register here.
        </NavLink>
      </p>
    </main>
  );
}

export default Login;
