import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import ErrorComponent from "../../error/ErrorComponent";
import useError from "../../error/useError";
import ModalHeader from "../../modals/ModalHeader";
import GroupExpenseForm from "./GroupExpenseForm";
import { usePopup } from "../../../context/PopupContext";
import { addExpenseToDatabase } from "../../../database/expenses";

function EditGroupExpenseModal({ toggleModal, oldExpense, group }) {
  const { error, setError } = useError();
  const { user } = useAuth();
  const [expense, setExpense] = useState({
    ...oldExpense,
    date: oldExpense.date.toDate()
  });

  const { showPopup } = usePopup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newExpense = {
        ...expense
      };
      await addExpenseToDatabase(newExpense);
      showPopup("Expense Updated");
      toggleModal();
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  if (!group || !user) return;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Edit expense
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

export default EditGroupExpenseModal;
