import { useParams } from "react-router-dom";
import ModalHeader from "../../modals/ModalHeader";
import { useAuth } from "../../../context/AuthContext";
import { nanoid } from "nanoid";
import { getCurrencyIconFromSymbol } from "../../../utility/money";
import useGroup from "../../../hooks/useGroup";
import { useState } from "react";
import GroupExpenseForm from "./GroupExpenseForm";
import { addExpenseToDatabase } from "../../../database/expenses";
import { addGroupToDatabase } from "../../../database/groups";
import useError from "../../error/useError";
import ErrorComponent from "../../error/ErrorComponent";
import { usePopup } from "../../../context/PopupContext";

function AddGroupExpenseModal({ toggleModal }) {
  const { id } = useParams();
  const { group } = useGroup(id);
  const { user } = useAuth();
  const [expense, setExpense] = useState({
    date: new Date(),
    title: "",
    amount: "",
    currency: getCurrencyIconFromSymbol(user.defaultCurrency),
    split: {},
    id: nanoid(),
    sucker: user.id,
    group: id
  });
  const { error, setError } = useError();
  const { showPopup } = usePopup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (Object.values(expense.split).reduce((split, acc) => split + acc) < 1)
        throw new Error("The Splits don't line up to 100%");

      if (expense.title === "")
        throw new Error("Your Expense must have a title");

      if (expense.amount === "" || expense.amount <= 0)
        throw new Error("Amount must be greater than zero");

      await handleNewExpense();
      setError(null);
      toggleModal();
      showPopup("expense added");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewExpense = async () => {
    const newExpense = {
      date: expense.date,
      title: expense.title,
      amount: Number.parseFloat(expense.amount),
      currency: expense.currency,
      split: expense.split,
      id: expense.id,
      sucker: expense.sucker,
      group: id,
      users: [...group.users],
      settled: false,
      creationTime: new Date(),
      creator: user.id,
      paidBy: []
    };
    await addExpenseToDatabase(newExpense);
    await addGroupToDatabase({
      ...group,
      expenses: [...group.expenses, expense.id]
    });
  };

  if (!group || !user) return;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Add group expense
      </ModalHeader>
      <ErrorComponent>{error}</ErrorComponent>
      <GroupExpenseForm
        expense={expense}
        setExpense={setExpense}
        group={group}
        user={user}
      />
    </>
  );
}

export default AddGroupExpenseModal;
