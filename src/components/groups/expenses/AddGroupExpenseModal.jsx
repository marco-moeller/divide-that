import { useParams } from "react-router-dom";
import ModalHeader from "../../modals/ModalHeader";
import { useAuth } from "../../../context/AuthContext";
import { nanoid } from "nanoid";
import { getCurrencyIconFromSymbol } from "../../../utility/money";
import useGroup from "../../../hooks/useGroup";
import { useEffect, useState } from "react";
import GroupExpenseForm from "./GroupExpenseForm";
import { addExpenseToDatabase } from "../../../database/expenses";
import { addGroupToDatabase } from "../../../database/groups";
import useError from "../../error/useError";
import ErrorComponent from "../../error/ErrorComponent";
import { usePopup } from "../../../context/PopupContext";
import { activityTypes, getNewActivity } from "../../../utility/interfaces";
import { addNewActivityToDatabase } from "../../../API/activitiesAPI";
import useGroupMembers from "../../../hooks/useGroupMembers";
import ModalBody from "../../modals/ModalBody";

function AddGroupExpenseModal({ toggleModal }) {
  const { id } = useParams();
  const { group } = useGroup(id);
  const { members } = useGroupMembers(group?.users);

  const { user } = useAuth();
  const [expense, setExpense] = useState({
    date: new Date(),
    title: "",
    amount: "",
    currency: getCurrencyIconFromSymbol(user.defaultCurrency),
    split: {},
    id: nanoid(),
    sucker: user.id,
    group: id,
    users: []
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

      if (expense.title.length > 20)
        throw new Error("Title can't be longer than 20 characters");

      await handleNewExpense();
      await handleNewActivity();

      toggleModal();
      setError(null);
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
      users: expense.users,
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

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [...members],
      type: activityTypes.addedGroupExpense,
      expenseName: expense.title,
      groupName: group.name,
      expenseID: expense.id
    });
    addNewActivityToDatabase(newActivity);
  };

  useEffect(() => {
    if (group?.users) {
      setExpense((prev) => ({
        ...prev,
        users: group.users
      }));
    }
  }, [group?.users]);

  useEffect(() => {
    if (!members || !expense?.users) return;

    const evenSplitPercentage = Math.round(100 / expense.users.length) / 100;

    setExpense((prevState) => ({
      ...prevState,
      split: members.reduce((acc, member) => {
        acc[member.id] = evenSplitPercentage;
        return acc;
      }, {})
    }));
  }, [members, expense?.users]);

  if (!group || !user || !members) return;

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Add group expense
      </ModalHeader>
      <ModalBody>
        <ErrorComponent>{error}</ErrorComponent>
        <GroupExpenseForm
          expense={expense}
          setExpense={setExpense}
          group={group}
          user={user}
          members={members}
        />
      </ModalBody>
    </>
  );
}

export default AddGroupExpenseModal;
