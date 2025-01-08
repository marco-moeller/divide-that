import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import ErrorComponent from "../../error/ErrorComponent";
import useError from "../../error/useError";
import ModalHeader from "../../modals/ModalHeader";
import GroupExpenseForm from "./GroupExpenseForm";
import { usePopup } from "../../../context/PopupContext";
import { addExpenseToDatabase } from "../../../database/expenses";
import useGroupMembers from "../../../hooks/useGroupMembers";
import { activityTypes, getNewActivity } from "../../../utility/interfaces";
import { addNewActivityToDatabase } from "../../../API/activitiesAPI";

function EditGroupExpenseModal({ toggleModal, oldExpense, group }) {
  const { error, setError } = useError();
  const { user } = useAuth();
  const [expense, setExpense] = useState({
    ...oldExpense,
    date: oldExpense.date.toDate()
  });

  const { members } = useGroupMembers(group?.users);
  const { showPopup } = usePopup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newExpense = {
      ...expense
    };
    try {
      if (
        Object.values(newExpense.split).reduce((split, acc) => split + acc) < 1
      )
        throw new Error("The Splits don't line up to 100%");

      if (newExpense.title === "")
        throw new Error("Your Expense must have a title");

      if (newExpense.amount === "" || expense.amount <= 0)
        throw new Error("Amount must be greater than zero");

      await addExpenseToDatabase(newExpense);
      await handleNewActivity();
      showPopup("Expense Updated");
      toggleModal();
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [...members],
      type: activityTypes.updatedGroupExpense,
      expenseName: expense.title,
      groupName: group.name,
      expenseID: expense.id
    });
    addNewActivityToDatabase(newActivity);
  };

  if (!group || !user || !members) return;

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
        members={members}
      />
    </>
  );
}

export default EditGroupExpenseModal;
