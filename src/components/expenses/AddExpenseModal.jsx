import ModalHeader from "../modals/ModalHeader";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { nanoid } from "nanoid";
import { useAuth } from "../../context/AuthContext";
import { addExpenseToDatabase } from "../../database/expenses";
import { addActivityToUser } from "../../API/userAPI";
import useFriend from "../../hooks/useFriend";
import { useParams } from "react-router-dom";
import { getCurrencyIconFromSymbol } from "../../utility/money";
import ExpenseForm from "./ExpenseForm";
import { usePopup } from "../../context/PopupContext";

function AddExpenseModal({ toggleModal }) {
  const { user, profileImgUrl: userProfileUrl } = useAuth();
  const { id } = useParams();
  const { friend, profileImgUrl } = useFriend(id);

  const [expense, setExpense] = useState({
    date: new Date(),
    title: "",
    amount: "",
    currency: getCurrencyIconFromSymbol(user.defaultCurrency),
    split: 0.5,
    id: nanoid(),
    sucker: user.id
  });

  const { showPopup } = usePopup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    toggleModal();
    try {
      await handleNewExpense();
      await handleNewActivity();

      showPopup("Expense Added");
    } catch (error) {
      console.log(error);
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
      users: [user.id, friend.id],
      sucker: expense.sucker,
      settled: false,
      creationTime: new Date()
    };
    await addExpenseToDatabase(newExpense);
  };

  const handleNewActivity = async () => {
    const newActivity = {
      title: expense.title,
      users: [user.id, friend.id],
      who: user.userName,
      date: new Date(),
      type: "add",
      expense: expense.id
    };
    await addActivityToUser(user, newActivity);
    await addActivityToUser(friend, newActivity);
  };

  if (!friend || !user) return <></>;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Add expense
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

export default AddExpenseModal;
