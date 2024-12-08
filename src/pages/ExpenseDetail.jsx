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
import { FaHandshake } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

function ExpenseDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { expense, refreshExpense } = useExpense(id);

  const { user, profileImgUrl: userProfileUrl } = useAuth();

  const { friend, profileImgUrl } = useFriend(
    expense?.users[0] === user?.id ? expense?.users[1] : expense?.users[0]
  );

  const handleSettleClick = async () => {
    await addExpenseToDatabase({ ...expense, settled: true });
    window.dispatchEvent(new Event("expenseUpdate"));
  };

  const handleUnsettleClick = async () => {
    await addExpenseToDatabase({ ...expense, settled: false });
    window.dispatchEvent(new Event("expenseUpdate"));
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
    navigate(-1);
  };

  useEffect(() => {
    const handleExpenseUpdate = async () => {
      await refreshExpense();
    };

    window.addEventListener("expenseUpdate", handleExpenseUpdate);
    return () =>
      window.removeEventListener("expenseUpdate", handleExpenseUpdate);
  }, []);

  if (!expense || !friend || !user) return <></>;

  return (
    <main className="expense-detail">
      <div className="hero-bg">
        <BackButton />
        <div className="delete-btn" onClick={() => handleDelete(expense.id)}>
          <MdDeleteForever />
        </div>
        <EditExpenseButton expense={expense} />
      </div>
      <div className="expense-content">
        <div className="grid">
          <img
            src={userProfileUrl}
            alt="profile image"
            className="profile-pic-small"
          />
          <FaHandshake />
          <FriendProfilePicture
            profileImgUrl={profileImgUrl}
            friendID={friend.id}
          />
          <h2 className="name">You</h2>
          <p></p>
          <h2 className="name">{friend.userName}</h2>
        </div>
        <h1>
          {expense.title} - {expense.currency + addZeros(expense.amount)}
        </h1>
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
      {!expense.settled && (
        <button className="settle-btn" onClick={handleSettleClick}>
          settle expense
        </button>
      )}
      {expense.settled && (
        <button className="settle-btn" onClick={handleUnsettleClick}>
          unsettle expense
        </button>
      )}
    </main>
  );
}

export default ExpenseDetail;
