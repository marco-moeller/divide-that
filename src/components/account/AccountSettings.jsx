import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { currencies } from "../../data/data";
import ModalHeader from "../modals/ModalHeader";
import { MdOutlineModeEdit } from "react-icons/md";
import useVisibilityToggle from "../../hooks/useVisibilityToggle";
import { deleteUserAccount, updateUserData } from "../../API/userAPI";
import { useStatus } from "../../context/StatusContext";
import { useNavigate } from "react-router-dom";
import {
  getCurrencyIconFromSymbol,
  getCurrencyName,
  getCurrencySymbolFromIcon
} from "../../utility/money";
import { activityTypes, getNewActivity } from "../../utility/interfaces";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";
import useAllUsers from "../../hooks/useAllUsers";
import ErrorComponent from "../error/ErrorComponent";

function AccountSettings({ toggleModal }) {
  const { allUsers } = useAllUsers();

  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ...user,
    confirmPassword: "",
    password: ""
  });
  const { status, setStatus, error, setError } = useStatus();
  const navigate = useNavigate();

  const { isShowing: isShowingUserName, toggle: toggleUserName } =
    useVisibilityToggle();

  const { isShowing: isShowingCurrency, toggle: toggleCurrency } =
    useVisibilityToggle();

  const { isShowing: isShowingEmail, toggle: toggleEmail } =
    useVisibilityToggle();

  const { isShowing: isShowingPassword, toggle: togglePassword } =
    useVisibilityToggle();

  const { isShowing: isShowingDeleteBtn, toggle: toggleDeleteBtn } =
    useVisibilityToggle();

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const emailIsAlreadyInUse = () => {
    const allOtherUsersEmails = allUsers
      .map((user) => user.email)
      .filter((email) => email !== user.email);

    return allOtherUsersEmails.includes(formData.email);
  };

  const handleSubmit = async () => {
    if (status !== "idle") {
      return;
    }
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match!");
      }
      if (emailIsAlreadyInUse()) {
        throw new Error("This email is already in use!");
      }

      setStatus("submitting");
      await updateUserData(user, {
        ...formData,
        defaultCurrency:
          getCurrencySymbolFromIcon(formData.defaultCurrency) ||
          formData.defaultCurrency
      });
      await handleNewActivity();
      toggleModal();
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setStatus("idle");
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [user],
      type: activityTypes.updatedAccount
    });
    addNewActivityToDatabase(newActivity);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount(user.id, user.profileImage);
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  if (allUsers.length === 0 || !user) return <></>;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Account Settings
      </ModalHeader>
      <div className="account-settings fd-column flex">
        <ErrorComponent>{error}</ErrorComponent>

        <label htmlFor="user-name">Username</label>
        {!isShowingUserName && (
          <h2 name="user-name">
            {formData.userName}
            <MdOutlineModeEdit onClick={toggleUserName} />
          </h2>
        )}
        {isShowingUserName && (
          <input
            name="userName"
            id="userName"
            onChange={handleChange}
            type="userName"
            placeholder={user.userName}
            value={formData.userName}
            autoComplete="on"
          />
        )}
        <label htmlFor="email">Email</label>
        {!isShowingEmail && (
          <h2 className="user-email" name="email">
            {formData.email}
            <MdOutlineModeEdit onClick={toggleEmail} />
          </h2>
        )}
        {isShowingEmail && (
          <input
            name="email"
            id="email"
            onChange={handleChange}
            type="email"
            placeholder="Email address"
            autoComplete="on"
            value={formData.email}
          />
        )}
        <label htmlFor="currency">Default Currency</label>
        {!isShowingCurrency && (
          <h2 className="user-currency" name="currency">
            {getCurrencyName(formData.defaultCurrency)}
            <MdOutlineModeEdit onClick={toggleCurrency} />
          </h2>
        )}
        {isShowingCurrency && (
          <select
            name="defaultCurrency"
            id="defaultCurrency"
            value={formData?.defaultCurrency}
            onChange={handleChange}
          >
            <option value={getCurrencyIconFromSymbol(user.defaultCurrency)}>
              {getCurrencyIconFromSymbol(user.defaultCurrency)}
            </option>
            {currencies
              .filter((currency) => currency.symbol !== user.defaultCurrency)
              .map((currency) => (
                <option value={currency.icon} key={currency.icon}>
                  {currency.icon}
                </option>
              ))}
          </select>
        )}
        <label htmlFor="password">Password</label>
        {!isShowingPassword && (
          <h2 className="user-password " id="password" name="password">
            {"******"}
            <MdOutlineModeEdit onClick={togglePassword} />
          </h2>
        )}
        {isShowingPassword && (
          <>
            <input
              name="password"
              onChange={handleChange}
              type="password"
              placeholder="New Password"
              autoComplete="on"
              value={formData.newPassword}
            />
            <input
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              placeholder="Confirm Password"
              autoComplete="on"
              value={formData.confirmPassword}
            />
          </>
        )}
        <div className="divider"></div>
        <button
          onClick={toggleDeleteBtn}
          disabled={status !== "idle"}
          className="btn"
        >
          Delete Account
        </button>
        {isShowingDeleteBtn && (
          <button
            className="red btn"
            onClick={handleDeleteAccount}
            disabled={status !== "idle"}
          >
            Confirm Delete Account
          </button>
        )}
      </div>
    </>
  );
}

export default AccountSettings;
