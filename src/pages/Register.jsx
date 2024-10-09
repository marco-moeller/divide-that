import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllUsersFromDatabase } from "../database/user";
import { registerNewUser } from "../API/userAPI";

function Register() {
  const [registerFormData, setRegisterFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: ""
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") {
      return;
    }
    try {
      setStatus("submitting");
      if (registerFormData.password !== registerFormData.confirmPassword) {
        throw new Error("Passwords don't match!");
      }

      const userList = await getAllUsersFromDatabase();
      if (
        userList.filter((user) => user.userName === registerFormData.userName)
          .length !== 0
      ) {
        throw new Error("Username already taken!");
      }

      if (
        userList.filter((user) => user.email === registerFormData.email)
          .length !== 0
      ) {
        throw new Error("Email already taken!");
      }

      await registerNewUser({
        ...registerFormData,
        friends: [],
        defaultCurrency: "USD",
        friendRequests: [],
        activities: [],
        profileImage: ""
      });
      navigate("/");
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setStatus("idle");
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  return (
    <main className="register">
      {" "}
      <h1>Register a new Account</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="userName"
          onChange={handleChange}
          type="userName"
          placeholder="Name"
          value={registerFormData.userName}
          autoComplete="on"
        />
        <input
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          autoComplete="on"
          value={registerFormData.email}
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          autoComplete="on"
          value={registerFormData.password}
        />
        <input
          name="confirmPassword"
          onChange={handleChange}
          type="password"
          placeholder="Confirm Password"
          autoComplete="on"
          value={registerFormData.confirmPassword}
        />
        <button disabled={status === "submitting"}>Register</button>
        <p className="red">{error?.message}</p>
      </form>
      <p>
        {"Already registered? "}
        <NavLink to="/login" className="green">
          Login here.
        </NavLink>
      </p>
    </main>
  );
}

export default Register;