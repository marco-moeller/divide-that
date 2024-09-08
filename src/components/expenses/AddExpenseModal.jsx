import { currencies } from "../../data/data";
import { convertToLocaleDate } from "../../utility/date";
import ModalHeader from "../modals/ModalHeader";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { nanoid } from "nanoid";
import { useAuth } from "../../context/AuthContext";
import { addExpenseToDatabase } from "../../database/expenses";
import { addActivityToUser } from "../../API/userAPI";
import useFriend from "../../hooks/useFriend";
import { useParams } from "react-router-dom";
import FriendProfilePicture from "../friends/FriendProfilePicture";
import { getCurrencyIconFromSymbol } from "../../utility/money";
import { userHasPaid } from "../../utility/expenseDisplay";

function AddExpenseModal({ toggleModal, toggleAddExpensePopup }) {
  const { id } = useParams();

  const { user, profileImgUrl: userProfileUrl } = useAuth();
  const { friend, profileImgUrl } = useFriend(id);

  const [expense, setExpense] = useState({
    date: new Date(),
    title: "",
    amount: "",
    currency: getCurrencyIconFromSymbol(user.defaultCurrency),
    split: 0.5,
    id: nanoid(),
    sucker: {}
  });
  const [showCalendar, setShowCalendar] = useState(false);

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
    toggleModal();
    try {
      await handleNewExpense();
      await handleNewActivity();

      toggleAddExpensePopup();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewExpense = async () => {
    const newExpense = {
      date: expense.date,
      title: expense.title,
      amount: Number.parseFloat(expense.amount),
      currency: expense.currency,
      split: expense.split,
      id: expense.id,
      users: [user.id, friend.id],
      sucker: expense.sucker,
      settled: false,
      creationTime: new Date()
    };
    await addExpenseToDatabase(newExpense);
  };

  const handleNewActivity = async () => {
    const newActivity = {
      title: expense.title,
      users: [user.id, friend.id],
      who: user.userName,
      date: new Date(),
      type: "add",
      expense: expense.id
    };
    await addActivityToUser(user, newActivity);
    await addActivityToUser(friend, newActivity);
  };

  const getSuckerBtnBg = (id) => {
    return expense.sucker === id ? "bg-orange" : "";
  };

  useEffect(() => {
    if (user) {
      setSucker(user.id);
    }
  }, [user]);

  if (!friend || !user) return <></>;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Add expense
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
            className={getSuckerBtnBg(friend.id)}
            onClick={() => setSucker(friend.id)}
          >
            {friend.userName + " Paid"}
          </button>
        </div>
      </form>
    </>
  );
}

export default AddExpenseModal;
