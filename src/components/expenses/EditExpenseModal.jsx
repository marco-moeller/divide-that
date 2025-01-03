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

function EditExpenseModal({ toggleModal, oldExpense }) {
  const [expense, setExpense] = useState({
    ...oldExpense,
    date: oldExpense.date.toDate()
  });

  const { user, profileImgUrl: userProfileUrl } = useAuth();
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
    toggleModal();
    try {
      await addExpenseToDatabase(newExpense);
      await handleNewActivity();
      showPopup("Expense Updated");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [user, friend],
      type: activityTypes.updatedExpense,
      expenseName: expense.title
    });
    addNewActivityToDatabase(newActivity);
  };

  if (!friend || !user) return <></>;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Edit expense
      </ModalHeader>
      <ExpenseForm
        expense={expense}
        setExpense={setExpense}
        userProfileUrl={userProfileUrl}
        profileImgUrl={profileImgUrl}
        friend={friend}
        user={user}
      />
    </>
  );
}

export default EditExpenseModal;
