import { convertToLocaleDate } from "../../utility/date";
import { addZeros } from "../../utility/money";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { memo } from "react";
import { getExpenseColor, userHasPaid } from "../../utility/expenseDisplay";

function Expense({ expense, friend }) {
  const { user } = useAuth();

  const getLentOrBorrowed = () => {
    return userHasPaid(user.id, expense.sucker) ? "you lent" : "you borrowed";
  };

  const getSplitAmount = () => {
    return expense.amount * (1 - expense.split);
  };

  if (!user) {
    return <div className="expense"></div>;
  }

  return (
    <div className="expense">
      <h3 className="date">{convertToLocaleDate(expense.date.toDate())}</h3>
      <div className="title-container">
        <NavLink to={`../../expense/${expense.id}`}>
          <h2 className="expense-title">{expense.title}</h2>
          <p className="subtitle">
            {userHasPaid(user.id, expense.sucker) ? "You" : friend.userName}{" "}
            paid {expense.currency + addZeros(expense.amount)}
          </p>
        </NavLink>
      </div>
      <div
        className={`right-col ${getExpenseColor(
          userHasPaid(user.id, expense.sucker)
        )}`}
      >
        <span>{getLentOrBorrowed()}</span>
        <span className="lent-amount">
          {" "}
          {expense.currency}
          {addZeros(getSplitAmount())}
        </span>
      </div>
    </div>
  );
}

export default memo(Expense);
