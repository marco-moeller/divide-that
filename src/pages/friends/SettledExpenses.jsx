import { nanoid } from "nanoid";
import useSettledExpensesList from "../../hooks/useSettledExpensesList";
import { useParams } from "react-router-dom";
import { convertToMonthYear } from "../../utility/date";
import SettledExpense from "../../components/expenses/SettledExpense";
import BackButton from "../../components/layout/BackButton";
import NoExpenses from "../../components/expenses/NoExpenses";

function SettledExpenses() {
  const { id } = useParams();
  const expensesList = useSettledExpensesList(id);

  const renderExpenses = () => {
    let currentMonth = null;

    return expensesList.map((expense) => {
      if (currentMonth !== expense.date.toDate().getMonth()) {
        currentMonth = expense.date.toDate().getMonth();
        return (
          <div key={nanoid()}>
            <p>{convertToMonthYear(expense.date.toDate())}</p>
            <SettledExpense expense={expense} />
          </div>
        );
      } else {
        return (
          <div key={nanoid()}>
            <SettledExpense expense={expense} />
          </div>
        );
      }
    });
  };

  return (
    <main className="settled-expenses">
      <BackButton />
      <h2 className="page-title">settled expenses</h2>
      {}
      {expensesList.length === 0 ? <NoExpenses /> : renderExpenses()}
    </main>
  );
}

export default SettledExpenses;
