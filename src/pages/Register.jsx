import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllUsersFromDatabase } from "../database/user";
import { registerNewUser } from "../API/userAPI";
import BackButton from "../components/layout/BackButton";
import ErrorComponent from "../components/error/ErrorComponent";
import useError from "../components/error/useError";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Register() {
  const [registerFormData, setRegisterFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    checkbox: false
  });
  const [status, setStatus] = useState("idle");
  const { error, setError } = useError();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") {
      return;
    }
    try {
      setStatus("submitting");

      if (registerFormData.checkbox) {
        throw new Error("Try again!");
      }

      if (registerFormData.userName === "Deleted User") {
        throw new Error("Invalid name!");
      }

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

      if (!EMAIL_REGEX.test(registerFormData.email)) {
        throw new Error("Invalid Email!");
      }

      await registerNewUser(
        {
          email: registerFormData.email,
          userName: registerFormData.userName
        },
        registerFormData.password
      );
      navigate("/");
      setError(null);
    } catch (error) {
      setError(error.message);
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
      <BackButton />
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
        <button disabled={status === "submitting"} className="btn">
          Register
        </button>
        <input
          type="checkbox"
          name="checkbox"
          value={registerFormData.checkbox}
          className="contact--me--by--fax--only"
          tabIndex={-1}
          autoComplete="off"
          checked={registerFormData.checkbox}
          onChange={handleChange}
          style={{ display: "none" }}
        ></input>
        <ErrorComponent>{error}</ErrorComponent>
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
