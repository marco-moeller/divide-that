import ModalHeader from "../modals/ModalHeader";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { nanoid } from "nanoid";
import { useAuth } from "../../context/AuthContext";
import { addExpenseToDatabase } from "../../database/expenses";
import {
  addExpenseToUser,
  updateLatestFriendInteraction
} from "../../API/userAPI";
import useFriend from "../../hooks/useFriend";
import { useParams } from "react-router-dom";
import { getCurrencyIconFromSymbol } from "../../utility/money";
import ExpenseForm from "./ExpenseForm";
import { usePopup } from "../../context/PopupContext";
import { activityTypes, getNewActivity } from "../../utility/interfaces";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";
import useError from "../error/useError";
import ErrorComponent from "../error/ErrorComponent";
import ModalBody from "../modals/ModalBody";

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

  const { error, setError } = useError();
  const { showPopup } = usePopup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (expense.title === "")
        throw new Error("Your Expense must have a title");

      if (expense.amount === "" || expense.amount <= 0)
        throw new Error("Amount must be greater than zero");

      if (expense.title.length > 20)
        throw new Error("Title can't be longer than 20 characters");

      await handleNewExpense();
      await handleNewActivity();
      await updateLatestFriendInteraction(user.id, friend.id);

      toggleModal();
      setError(null);
      showPopup("Expense Added");
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
      group: "",
      users: [user.id, friend.id],
      settled: false,
      creationTime: new Date(),
      creator: user.id,
      paidBy: []
    };
    await addExpenseToDatabase(newExpense);
    await addExpenseToUser(user, expense.id);
    await addExpenseToUser(friend, expense.id);
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [user, friend],
      type: activityTypes.addedExpense,
      expenseName: expense.title,
      expenseID: expense.id
    });
    addNewActivityToDatabase(newActivity);
  };

  if (!friend || !user) return <></>;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Add expense
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

export default AddExpenseModal;
