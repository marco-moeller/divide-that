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
    try {
      const newExpense = {
        ...expense
      };
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
