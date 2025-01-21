import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllUsersFromDatabase } from "../database/user";
import { registerNewUser } from "../API/userAPI";
import BackButton from "../components/layout/BackButton";
import ErrorComponent from "../components/error/ErrorComponent";
import useError from "../components/error/useError";
import { useStatus } from "../context/StatusContext";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const MAX_USERNAME_CHARS = 15;

function Register() {
  const [registerFormData, setRegisterFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    checkbox: false
  });
  const { status, setStatus, STATUS_TYPES } = useStatus();
  const { error, setError } = useError();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== STATUS_TYPES.IDLE) {
      return;
    }
    try {
      setStatus(STATUS_TYPES.SUBMITTING);

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

      if (registerFormData.userName.length > 15) {
        throw new Error("Name can't be longer than 15 characters!");
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
      setStatus(STATUS_TYPES.IDLE);
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
          maxLength={MAX_USERNAME_CHARS}
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
        <button disabled={status !== STATUS_TYPES.IDLE} className="btn">
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
