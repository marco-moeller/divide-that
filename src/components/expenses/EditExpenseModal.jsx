import ModalHeader from "../modals/ModalHeader";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../../context/AuthContext";
import useFriend from "../../hooks/useFriend";
import { addExpenseToDatabase } from "../../database/expenses";
import ExpenseForm from "./ExpenseForm";
import { usePopup } from "../../context/PopupContext";
import { activityTypes, getNewActivity } from "../../utility/interfaces";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";
import useError from "../error/useError";
import ErrorComponent from "../error/ErrorComponent";
import { updateLatestFriendInteraction } from "../../API/userAPI";
import ModalBody from "../modals/ModalBody";

function EditExpenseModal({ toggleModal, oldExpense }) {
  const [expense, setExpense] = useState({
    ...oldExpense,
    date: oldExpense.date.toDate()
  });

  const { user, profileImgUrl: userProfileUrl } = useAuth();

  const { error, setError } = useError();
  const { showPopup } = usePopup();

  const friendID =
    oldExpense.users[0] === user?.id
      ? oldExpense.users[1]
      : oldExpense.users[0];
  const { friend, profileImgUrl } = useFriend(friendID);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newExpense = {
      ...expense
    };
    try {
      if (newExpense.title === "")
        throw new Error("Your Expense must have a title");

      if (newExpense.amount === "" || expense.amount <= 0)
        throw new Error("Amount must be greater than zero");

      await addExpenseToDatabase(newExpense);
      await handleNewActivity();
      await updateLatestFriendInteraction(user.id, friend.id);
      toggleModal();
      setError(null);
      showPopup("Expense Updated");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [user, friend],
      type: activityTypes.updatedExpense,
      expenseName: expense.title,
      expenseID: expense.id
    });
    addNewActivityToDatabase(newActivity);
  };

  if (!friend || !user) return <></>;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Edit expense
      </ModalHeader>
      <ModalBody>
        <ErrorComponent>{error}</ErrorComponent>
        <ExpenseForm
          expense={expense}
          setExpense={setExpense}
          userProfileUrl={userProfileUrl}
          profileImgUrl={profileImgUrl}
          friend={friend}
          user={user}
        />
      </ModalBody>
    </>
  );
}

export default EditExpenseModal;
