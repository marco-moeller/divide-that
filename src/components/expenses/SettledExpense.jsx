import { convertToLocaleDate } from "../../utility/date";
import { addZeros } from "../../utility/money";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { addExpenseToDatabase } from "../../database/expenses";
import { getExpenseColor, userHasPaid } from "../../utility/expenseDisplay";

function SettledExpense({ expense }) {
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

  const handleClick = async () => {
    await addExpenseToDatabase({ ...expense, settled: false });
  };

  return (
    <div className="expense">
      <h3 className="date">{convertToLocaleDate(expense.date.toDate())}</h3>
      <div className="title-container">
        <NavLink to={`../expense/${expense.id}`}>
          <h2 className="title">{expense.title}</h2>
          <p className="subtitle">
            {expense.payer} paid {expense.currency + addZeros(expense.amount)}
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
      <button className="unsettle-btn btn" onClick={handleClick}>
        unsettle
      </button>
    </div>
  );
}

export default SettledExpense;
