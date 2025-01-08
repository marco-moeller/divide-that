import { FaCalendarAlt } from "react-icons/fa";
import { convertToLocaleDate } from "../../utility/date";
import Calendar from "react-calendar";
import { useState } from "react";
import FriendProfilePicture from "../friends/FriendProfilePicture";
import { userHasPaid } from "../../utility/expenseDisplay";
import { getCurrencyIconFromSymbol } from "../../utility/money";
import { currencies } from "../../data/data";

function ExpenseForm({
  expense,
  setExpense,
  userProfileUrl,
  profileImgUrl,
  friend,
  user
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = (event) => {
    event.preventDefault();
    setShowCalendar((prevState) => !prevState);
  };

  const handleDateChange = (date) => {
    setExpense((prevState) => ({ ...prevState, date: date }));
    setShowCalendar(false);
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

  const getSuckerBtnBg = (id) => {
    return expense.sucker === id ? "bg-purple" : "";
  };

  const setSucker = (id) => {
    setExpense((prevState) => ({ ...prevState, sucker: id }));
  };

  return (
    <form className="expense-form">
      <div className="calendar">
        <button onClick={toggleCalendar}>
          <FaCalendarAlt />
          {convertToLocaleDate(expense.date)}
        </button>
        {showCalendar && (
          <Calendar onChange={handleDateChange} value={expense.date} />
        )}
      </div>
      <div className="split">
        <img
          src={userProfileUrl}
          alt="profile image"
          className="profile-pic-small"
        />

        <FriendProfilePicture
          profileImgUrl={profileImgUrl}
          friendID={friend.id}
        />
        <h2>You</h2>
        <h2>{friend.userName}</h2>
        <div className="split-input-wrapper">
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
          <h2 className="percent">%</h2>
        </div>
        <div className="split-input-wrapper">
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
          <h2 className="percent">%</h2>
        </div>
      </div>

      <input
        type="text"
        name="title"
        id="title"
        placeholder="Title"
        value={expense.title}
        onChange={handleChange}
      />
      <div className="amount-input-wrapper">
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
        <select
          className="currency"
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
      </div>
      <div className="sucker">
        <button
          type="button"
          className={getSuckerBtnBg(user.id) + " btn"}
          onClick={() => setSucker(user.id)}
        >
          You Paid
        </button>
        <button
          type="button"
          className={getSuckerBtnBg(friend.id) + " btn"}
          onClick={() => setSucker(friend.id)}
        >
          {friend.userName + " Paid"}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
