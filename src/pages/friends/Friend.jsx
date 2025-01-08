import { nanoid } from "nanoid";
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

function Friend() {
  const { id } = useParams();
  const { expenses } = useFriendExpenses(id);
  const { friend, profileImgUrl } = useFriend(id);

  const renderExpenses = () => {
    let currentMonth = null;

    return expenses.map((expense) => {
      if (currentMonth !== expense.date.toDate().getMonth()) {
        currentMonth = expense.date.toDate().getMonth();
        return (
          <div key={nanoid()}>
            <p className="expense">
              {convertToMonthYear(expense.date.toDate())}
            </p>
            <Expense expense={expense} friend={friend} />
          </div>
        );
      } else {
        return (
          <div key={nanoid()}>
            <Expense friend={friend} expense={expense} />
          </div>
        );
      }
    });
  };

  const handleSettleUp = async () => {
    expenses.forEach(async (expense) => {
      await addExpenseToDatabase({ ...expense, settled: true });
    });
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
          <button className="bg-purple purple-bnt" onClick={handleSettleUp}>
            settle up
          </button>
          <NavLink to={"./settledExpenses"} className="btn">
            History
          </NavLink>
        </section>
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
