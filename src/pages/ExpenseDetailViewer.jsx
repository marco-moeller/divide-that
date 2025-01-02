import { useParams } from "react-router-dom";
import useExpense from "../hooks/useExpense";
import ExpenseDetail from "./ExpenseDetail";
import GroupExpenseDetail from "./GroupExpenseDetail";

function ExpenseDetailViewer() {
  const { id } = useParams();
  const { expense } = useExpense(id);

  if (!expense?.group || expense.group === "") {
    return <ExpenseDetail />;
  }

  if (expense.group !== "") {
    return <GroupExpenseDetail />;
  }
}

export default ExpenseDetailViewer;
