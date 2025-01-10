import Hero from "../../components/friends/Hero";
import { NavLink, useParams } from "react-router-dom";
import useFriend from "../../hooks/useFriend";
import Expense from "../../components/expenses/Expense";
import NoExpenses from "../../components/expenses/NoExpenses";
import { convertToMonthYear } from "../../utility/date";
import AddExpenseButton from "../../components/expenses/AddExpenseButton";
import { addExpenseToDatabase } from "../../database/expenses";
import DebtInfo from "../../components/friends/DebtInfo";
import useFriendExpenses from "../../hooks/useFriendExpenses";
import ErrorComponent from "../../components/error/ErrorComponent";
import useError from "../../components/error/useError";

function Friend() {
  const { id } = useParams();
  const { expenses } = useFriendExpenses(id);
  const { friend, profileImgUrl } = useFriend(id);
  const { error, setError } = useError();

  const renderExpenses = () => {
    let currentMonth = null;

    return expenses.map((expense) => {
      if (currentMonth !== expense.date.toDate().getMonth()) {
        currentMonth = expense.date.toDate().getMonth();
        return (
          <div key={expense.id}>
            <p className="expense">
              {convertToMonthYear(expense.date.toDate())}
            </p>
            <Expense expense={expense} friend={friend} />
          </div>
        );
      } else {
        return (
          <div key={expense.id}>
            <Expense friend={friend} expense={expense} />
          </div>
        );
      }
    });
  };

  const handleSettleUp = async () => {
    try {
      expenses.forEach(async (expense) => {
        await addExpenseToDatabase({ ...expense, settled: true });
      });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (!friend) {
    return <main></main>;
  }

  return (
    <>
      <Hero friend={friend} profileImgUrl={profileImgUrl} />
      <DebtInfo friend={friend} expenses={expenses} />
      <main className="friend-main">
        <section className="control-btns">
          <button className="bg-purple purple-btn" onClick={handleSettleUp}>
            settle up
          </button>
          <NavLink to={"./settledExpenses"} className="btn">
            History
          </NavLink>
        </section>
        <ErrorComponent>{error}</ErrorComponent>

        <section className="expenses">
          {!expenses.length && <NoExpenses />}
          {expenses.length > 0 && renderExpenses()}
        </section>
        <AddExpenseButton />
      </main>
    </>
  );
}

export default Friend;
