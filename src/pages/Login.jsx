import { useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { doPasswordReset, loginUser } from "../database/auth";
import { useAuth } from "../context/AuthContext";
import { usePopup } from "../context/PopupContext";
import BackButton from "../components/layout/BackButton";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Login() {
  const { showPopup } = usePopup();

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
      if (!EMAIL_REGEX.test(loginFormData.email)) {
        throw new Error("Invalid Email!");
      }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordReset = () => {
    try {
      if (!EMAIL_REGEX.test(loginFormData.email)) {
        throw new Error("Type your correct email address above!");
      }

      doPasswordReset(loginFormData.email);
      showPopup("Reset Email sent");
    } catch (error) {
      setError(error);
    }
  };

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <main className="login">
      {" "}
      <BackButton />
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
        <p className="red">{error?.message}</p>
      </form>
      <p>
        {"No Account yet? "}
        <NavLink to="/register" className="green">
          Register here.
        </NavLink>
      </p>
      <p>
        Forgot your Password?{" "}
        <span onClick={handlePasswordReset} className="green pointer">
          Send a reset email
        </span>
      </p>
    </main>
  );
}

export default Login;
