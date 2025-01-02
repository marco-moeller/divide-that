import { memo } from "react";
import { useAuth } from "../../../context/AuthContext";
import useExpense from "../../../hooks/useExpense";
import { convertToLocaleDate } from "../../../utility/date";
import { getExpenseColor, userHasPaid } from "../../../utility/expenseDisplay";
import { addZeros } from "../../../utility/money";
import { NavLink } from "react-router-dom";
import useFriend from "../../../hooks/useFriend";

function GroupExpense({ expense }) {
  const { user } = useAuth();

  const { friend: sucker } = useFriend(expense?.sucker);

  const getLentOrBorrowed = () => {
    return userHasPaid(user.id, expense.sucker) ? "you lent" : "you borrowed";
  };

  const getSplitAmount = () => {
    if (!Object.keys(expense.split).includes(user.id)) return 0;

    if (userHasPaid(user.id, expense.sucker)) {
      return expense.amount * (1 - expense.split[user.id]);
    } else {
      return expense.amount * expense.split[user.id];
    }
  };

  if (!user || !expense || !sucker) {
    return <div className="expense"></div>;
  }

  return (
    <div className="expense">
      <h3 className="date">{convertToLocaleDate(expense.date.toDate())}</h3>
      <div className="title-container">
        <NavLink to={`../../expense/${expense.id}`}>
          <h2 className="expense-title">{expense.title}</h2>
          <p className="subtitle">
            {userHasPaid(user.id, expense.sucker) ? "You" : sucker.userName}{" "}
            paid {expense.currency + addZeros(expense.amount)}
          </p>
        </NavLink>
      </div>
      <div
        className={`right-col ${getExpenseColor(
          userHasPaid(user.id, expense.sucker) || getSplitAmount() === 0
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

export default memo(GroupExpense);
