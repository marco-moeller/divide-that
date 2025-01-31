import { convertToLocaleDate } from "../../utility/date";
import { addZeros } from "../../utility/money";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { addExpenseToDatabase } from "../../database/expenses";
import { getExpenseColor, userHasPaid } from "../../utility/expenseDisplay";
import ErrorComponent from "../error/ErrorComponent";
import useError from "../error/useError";
import SubmitButton from "../layout/SubmitButton";

function SettledExpense({ expense }) {
  const { user } = useAuth();
  const { error, setError } = useError();

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
    try {
      await addExpenseToDatabase({ ...expense, settled: false });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="expense">
        <h3 className="date">{convertToLocaleDate(expense.date.toDate())}</h3>
        <div className="title-container">
          <NavLink to={`../expense/${expense.id}`}>
            <h2 className="expense-title">{expense.title}</h2>
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
      <SubmitButton className="unsettle-btn btn" onClick={handleClick}>
        unsettle
      </SubmitButton>
      <ErrorComponent>{error}</ErrorComponent>
    </>
  );
}

export default SettledExpense;
