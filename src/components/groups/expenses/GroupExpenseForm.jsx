import { FaCalendarAlt } from "react-icons/fa";
import { convertToLocaleDate } from "../../../utility/date";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import {
  cutAfterTwoDecimals,
  getCurrencyIconFromSymbol
} from "../../../utility/money";
import { currencies } from "../../../data/data";
import GroupListComponent from "../GroupListComponent";

const PRECISION = 1e20;

function GroupExpenseForm({ expense, setExpense, group, user, members }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [splitType, setSplitType] = useState("even");

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

  // [{userid: split}, {...}]
  const handlePercentSplitChange = (event) => {
    const { value, name } = event.target;
    if (value < 0 || value > 100) return;

    setExpense((prevState) => ({
      ...prevState,
      split: { ...prevState.split, [name]: value / 100 }
    }));
  };

  const handleAbsoluteSplitChange = (event) => {
    const { value, name } = event.target;
    if (
      value < 0 ||
      Number.parseFloat(value) > Number.parseFloat(expense.amount)
    )
      return;

    setExpense((prevState) => ({
      ...prevState,
      split: {
        ...prevState.split,
        [name]: Math.trunc((value / expense.amount) * PRECISION) / PRECISION
      }
    }));
  };

  const handleEvenSplitClick = (event) => {
    event.preventDefault();
    const evenSplitPercentage = Math.round(100 / expense.users.length) / 100;

    setSplitType("even");
    setExpense((prevState) => ({
      ...prevState,
      split: members?.reduce((acc, member) => {
        acc[member.id] = evenSplitPercentage;
        return acc;
      }, {})
    }));
  };

  const getSuckerBtnBg = (id) => {
    return expense.sucker === id ? "bg-purple" : "";
  };

  const getSplitTypeBtnBg = (type) => {
    return type === splitType ? "bg-purple" : "";
  };

  const setSucker = (id) => {
    setExpense((prevState) => ({ ...prevState, sucker: id }));
  };

  if (!members) return <></>;

  return (
    <form className="expense-form">
      <GroupListComponent groupID={group.id} />
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
        <button
          className={getSplitTypeBtnBg("even") + " btn"}
          onClick={handleEvenSplitClick}
        >
          Even Split
        </button>
        <button
          className={getSplitTypeBtnBg("percent") + " btn"}
          onClick={(e) => {
            e.preventDefault();
            setSplitType("percent");
          }}
        >
          % - Split
        </button>
        <button
          className={getSplitTypeBtnBg("absolute") + " btn"}
          onClick={(e) => {
            e.preventDefault();
            setSplitType("absolute");
          }}
        >
          Absolute Split
        </button>
      </div>
      {splitType === "percent" && (
        <div className="group-split">
          {members.map((member) => (
            <div key={member.userName}>
              <h2>{member.userName}</h2>
              <div className="split-input-wrapper">
                <input
                  type="number"
                  name={member.id}
                  id="split"
                  className="no-spinners"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(expense.split?.[member.id] * 100)}
                  onChange={handlePercentSplitChange}
                />
                <h2 className="percent">%</h2>
              </div>
            </div>
          ))}
        </div>
      )}
      {splitType === "absolute" && (
        <div className="group-split">
          {members.map((member) => (
            <div key={member.userName}>
              <h2>{member.userName}</h2>
              <div className="split-input-wrapper">
                <input
                  type="number"
                  name={member.id}
                  id="split"
                  className="no-spinners"
                  min="0"
                  max="100"
                  step="1"
                  value={cutAfterTwoDecimals(
                    Number(expense.split?.[member.id] * expense.amount).toFixed(
                      10
                    )
                  )}
                  onChange={handleAbsoluteSplitChange}
                />
                <h2 className="percent">{expense.currency}</h2>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="sucker">
        <button
          type="button"
          className={getSuckerBtnBg(user.id) + " btn"}
          onClick={() => setSucker(user.id)}
        >
          You Paid
        </button>
        {members
          .filter((member) => member.id !== user.id)
          .map((member) => (
            <button
              type="button"
              className={getSuckerBtnBg(member.id) + " btn"}
              onClick={() => setSucker(member.id)}
              key={member.id}
            >
              {member.userName + " Paid"}
            </button>
          ))}
      </div>
    </form>
  );
}

export default GroupExpenseForm;
