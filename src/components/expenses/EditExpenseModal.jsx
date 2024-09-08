import { currencies } from "../../data/data";
import { convertToLocaleDate } from "../../utility/date";
import ModalHeader from "../modals/ModalHeader";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../../context/AuthContext";
import useFriend from "../../hooks/useFriend";
import { addExpenseToDatabase } from "../../database/expenses";
import { addActivityToUser } from "../../API/userAPI";
import FriendProfilePicture from "../friends/FriendProfilePicture";
import { userHasPaid } from "../../utility/expenseDisplay";

function EditExpenseModal({ toggleModal, oldExpense, toggleEditExpensePopup }) {
  const [expense, setExpense] = useState({
    ...oldExpense,
    date: oldExpense.date.toDate()
  });

  const [showCalendar, setShowCalendar] = useState(false);

  const { user, profileImgUrl: userProfileUrl } = useAuth();

  const friendID =
    oldExpense.users[0] === user?.id
      ? oldExpense.users[1]
      : oldExpense.users[0];
  const { friend, profileImgUrl } = useFriend(friendID);

  const toggleCalendar = (event) => {
    event.preventDefault();
    setShowCalendar((prevState) => !prevState);
  };

  const handleAmountBlur = () => {
    setExpense((prevState) => {
      if (prevState.amount === "")
        return {
          ...prevState,
          amount: Number.parseFloat(0).toFixed(2)
        };

      return {
        ...prevState,
        amount: Number.parseFloat(prevState.amount).toFixed(2)
      };
    });
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    if (name === "amount" && value < 0) return;

    if (name === "amount" && value.match(/^([0-9]{1,})?(\.)?([0-9]{1,2})?$/)) {
      setExpense((prevState) => ({
        ...prevState,
        [name]: value
      }));
      return;
    }
    if (name === "amount" && !value.match(/^([0-9]{1,})?(\.)?([0-9]{1,2})?$/)) {
      return;
    }
    setExpense((prevState) => ({ ...prevState, [name]: value }));
  };

  //split is always from the perspective of the sucker
  // 0.6 split means the sucker pays for 60%
  const handleSplitChange = (event) => {
    const { value, name } = event.target;

    if (value < 0 || value > 100) return;

    if (name === "friend-split") {
      setExpense((prevState) =>
        userHasPaid(user.id, expense.sucker)
          ? { ...prevState, split: 1 - value * 0.01 }
          : { ...prevState, split: value * 0.01 }
      );
    }

    if (name === "split") {
      setExpense((prevState) =>
        userHasPaid(user.id, expense.sucker)
          ? { ...prevState, split: value * 0.01 }
          : { ...prevState, split: 1 - value * 0.01 }
      );
    }
  };

  const handleDateChange = (date) => {
    setExpense((prevState) => ({ ...prevState, date: date }));
    setShowCalendar(false);
  };

  const setSucker = (id) => {
    setExpense((prevState) => ({ ...prevState, sucker: id }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newExpense = {
      ...expense
    };
    toggleModal();
    try {
      await addExpenseToDatabase(newExpense);
      await handleNewActivity();
      window.dispatchEvent(new Event("expenseUpdate"));
      toggleEditExpensePopup();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = {
      title: expense.title,
      users: [user.id, friend.id],
      who: user.userName,
      date: new Date(),
      type: "update",
      expense: expense.id
    };
    await addActivityToUser(user, newActivity);
    await addActivityToUser(friend, newActivity);
  };

  const getSuckerBtnBg = (id) => {
    return expense.sucker === id ? "bg-orange" : "";
  };

  if (!friend || !user) return <></>;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Edit expense
      </ModalHeader>
      <div className="expense-context flex ">
        <p className="between flex">
          Between{" "}
          <img
            src={userProfileUrl}
            alt="profile image"
            className="profile-pic-small"
          />
          You and{" "}
          <FriendProfilePicture
            profileImgUrl={profileImgUrl}
            friendID={friend.id}
          />
          {friend.userName}
        </p>
      </div>
      <div className="divider"></div>
      <form>
        <div className="calendar">
          <button onClick={toggleCalendar}>
            {convertToLocaleDate(expense.date)}
          </button>
          {showCalendar && (
            <Calendar onChange={handleDateChange} value={expense.date} />
          )}
        </div>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          value={expense.title}
          onChange={handleChange}
        />
        <select
          name="currency"
          id="currency"
          value={expense.currency}
          onChange={handleChange}
        >
          {currencies.map((currency) => (
            <option value={currency.icon} key={currency.icon}>
              {currency.icon}
            </option>
          ))}
        </select>
        <input
          name="amount"
          id="amount"
          className="no-spinners"
          min="0"
          placeholder="0.00"
          value={expense.amount}
          onChange={handleChange}
          onBlur={handleAmountBlur}
        />
        <div className="split">
          <h2>{user.userName}</h2>
          <input
            type="number"
            name="split"
            id="split"
            className="no-spinners"
            min="0"
            max="100"
            step="1"
            value={
              userHasPaid(user.id, expense.sucker)
                ? `${Math.round(expense.split * 100)}`
                : `${Math.round(100 - expense.split * 100)}`
            }
            onChange={handleSplitChange}
          />
          <h2>%</h2>

          <h2>{friend.userName}</h2>
          <input
            type="number"
            name="friend-split"
            id="friend-split"
            className="no-spinners"
            min="0"
            max="100"
            step="1"
            value={
              userHasPaid(user.id, expense.sucker)
                ? `${Math.round(100 - expense.split * 100)}`
                : `${Math.round(expense.split * 100)}`
            }
            onChange={handleSplitChange}
          />
          <h2>%</h2>
        </div>
        <div className="sucker">
          <button
            type="button"
            className={getSuckerBtnBg(user.id)}
            onClick={() => setSucker(user.id)}
          >
            You Paid
          </button>
          <button
            type="button"
            className={getSuckerBtnBg(friend?.id)}
            onClick={() => setSucker(friend?.id)}
          >
            {friend?.userName + " Paid"}
          </button>
        </div>
      </form>
    </>
  );
}

export default EditExpenseModal;
