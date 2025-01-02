import { useNavigate, useParams } from "react-router-dom";
import useExpense from "../hooks/useExpense";
import BackButton from "../components/layout/BackButton";
import EditExpenseButton from "../components/expenses/EditExpenseButton";
import { convertToMonthDayYear } from "../utility/date";
import { addZeros } from "../utility/money";
import { useAuth } from "../context/AuthContext";
import useFriend from "../hooks/useFriend";
import { useEffect } from "react";
import FriendProfilePicture from "../components/friends/FriendProfilePicture";
import {
  addExpenseToDatabase,
  deleteExpenseFromDatabase
} from "../database/expenses";
import { getExpenseColor, userHasPaid } from "../utility/expenseDisplay";
import { usePopup } from "../context/PopupContext";
import { FaPlus } from "react-icons/fa";
import { addActivityToUser } from "../API/userAPI";

function ExpenseDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { expense } = useExpense(id);

  const { user, profileImgUrl: userProfileUrl } = useAuth();

  const { friend, profileImgUrl } = useFriend(
    expense?.users?.[0] === user?.id ? expense?.users?.[1] : expense?.users?.[0]
  );

  const { showPopup } = usePopup();

  const handleSettleClick = async () => {
    await addExpenseToDatabase({ ...expense, settled: true });
  };

  const handleUnsettleClick = async () => {
    await addExpenseToDatabase({ ...expense, settled: false });
  };

  const getLentOrBorrowed = () => {
    return userHasPaid(user.id, expense.sucker)
      ? `${friend.userName} owes you `
      : `You owe ${friend.userName} `;
  };

  const getCreator = () => {
    return expense?.users[0] === user?.id ? "you" : friend?.userName;
  };

  const getSplitAmount = () => {
    return expense.amount * (1 - expense.split);
  };

  const getUserSplitPercent = () => {
    if (userHasPaid(user.id, expense.sucker)) {
      return expense.split * 100;
    } else {
      return (1 - expense.split) * 100;
    }
  };

  const handleDelete = () => {
    deleteExpenseFromDatabase(id);
    handleNewActivity();
    showPopup("Expense Deleted");

    navigate(-1);
  };

  const handleNewActivity = async () => {
    const newActivity = {
      title: expense.title,
      users: [user.id, friend.id],
      who: user.userName,
      date: new Date(),
      type: "delete",
      expense: expense.id
    };
    await addActivityToUser(user, newActivity);
    await addActivityToUser(friend, newActivity);
  };

  if (!expense || !friend || !user) return <></>;

  return (
    <main className="expense-detail">
      <BackButton />
      <div className="expense-content">
        <h2 className="title">{expense.title}</h2>
        <div className="grid">
          <img
            src={userProfileUrl}
            alt="profile image"
            className="profile-pic-small"
          />
          <FaPlus />
          <FriendProfilePicture
            profileImgUrl={profileImgUrl}
            friendID={friend.id}
          />
          <h2 className="name">You</h2>
          <p></p>
          <h2 className="name">{friend.userName}</h2>
        </div>
        <h2 className="details">
          - {expense.currency + addZeros(expense.amount)} -
        </h2>
        <h3 className="details">
          {convertToMonthDayYear(expense.date.toDate())}
        </h3>
        <p className="subtitle">
          Added by {getCreator()}
          {expense.creationTime && (
            <> on {convertToMonthDayYear(expense.creationTime?.toDate())}</>
          )}
        </p>
        <div className="divider"></div>

        {expense.settled && <p>Settled.</p>}
        {!expense.settled && (
          <>
            <p>
              {userHasPaid(user.id, expense.sucker) ? "You" : friend.userName}{" "}
              paid {expense.currency + addZeros(expense.amount)}
            </p>
            <div
              className={`${getExpenseColor(
                userHasPaid(user.id, expense.sucker)
              )}`}
            >
              <span>{getLentOrBorrowed()}</span>
              <span className="lent-amount">
                {" "}
                {expense.currency}
                {addZeros(getSplitAmount())}
              </span>
              <span>{` (You ${getUserSplitPercent()}% / ${friend.userName} ${
                100 - getUserSplitPercent()
              }%)`}</span>
            </div>
          </>
        )}
      </div>
      <EditExpenseButton expense={expense} />
      {!expense.settled && (
        <button className="settle-btn btn" onClick={handleSettleClick}>
          settle expense
        </button>
      )}
      {expense.settled && (
        <button className="settle-btn btn" onClick={handleUnsettleClick}>
          unsettle expense
        </button>
      )}
      <button
        className="delete-btn bg-purple"
        onClick={() => handleDelete(expense.id)}
      >
        Delete Expense
      </button>
    </main>
  );
}

export default ExpenseDetail;
