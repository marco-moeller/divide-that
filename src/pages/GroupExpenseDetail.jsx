import { useNavigate, useParams } from "react-router-dom";
import useExpense from "../hooks/useExpense";
import BackButton from "../components/layout/BackButton";
import { convertToMonthDayYear } from "../utility/date";
import { addZeros } from "../utility/money";
import { useAuth } from "../context/AuthContext";
import {
  addExpenseToDatabase,
  deleteExpenseFromDatabase
} from "../database/expenses";
import { getExpenseColor } from "../utility/expenseDisplay";
import { usePopup } from "../context/PopupContext";
import useGroup from "../hooks/useGroup";
import GroupListComponent from "../components/groups/GroupListComponent";
import useGroupMembers from "../hooks/useGroupMembers";
import { deleteExpenseFromGroup } from "../API/groupsAPI";
import EditGroupExpenseButton from "../components/groups/expenses/EditGroupExpenseButton";
import React from "react";
import { activityTypes, getNewActivity } from "../utility/interfaces";
import { addNewActivityToDatabase } from "../API/activitiesAPI";
import ErrorComponent from "../components/error/ErrorComponent";
import useError from "../components/error/useError";
import SubmitButton from "../components/layout/SubmitButton";

function GroupExpenseDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { expense } = useExpense(id);

  const { group } = useGroup(expense?.group || 0);

  const { members } = useGroupMembers(
    [...Object.keys({ ...expense?.split })] || []
  );
  const { user } = useAuth();

  const { error, setError } = useError();
  const { showPopup } = usePopup();

  const handleSettleClick = async () => {
    try {
      await addExpenseToDatabase({
        ...expense,
        settled: true,
        paidBy: group.users.filter((user) => user !== expense.sucker)
      });
      setError(null);
      showPopup("Expense Settled");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUnsettleClick = async () => {
    try {
      await addExpenseToDatabase({ ...expense, settled: false, paidBy: [] });
      setError(null);
      showPopup("Expense Unsettled");
    } catch (error) {
      setError(error.message);
    }
  };

  const userIsSucker = () => {
    return user.id === expense.sucker;
  };

  const memberHasPaid = (member) => {
    return expense.paidBy.includes(member.id);
  };

  const getMemberNameOrYou = (member) => {
    return member.id === user.id ? "You" : member.userName;
  };

  const settleMember = async (member) => {
    try {
      await addExpenseToDatabase({
        ...expense,
        paidBy: [...expense.paidBy, member.id]
      });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const unsettleMember = async (member) => {
    try {
      await addExpenseToDatabase({
        ...expense,
        paidBy: [...expense.paidBy.filter((payer) => payer !== member.id)]
      });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const getUsernameById = (id, users) => {
    const user = users.find((user) => user.id === id);
    return user ? user.userName : null;
  };

  const getLentOrBorrowed = () => {
    const membersWhoStillHaveToPay = members.filter(
      (member) =>
        member.id !== expense.sucker && !expense.paidBy.includes(member.id)
    );

    return `${membersWhoStillHaveToPay.reduce((acc, member, index, array) => {
      if (index === 0) return getMemberNameOrYou(member);
      if (index === array.length - 1)
        return `${acc} and ${getMemberNameOrYou(member)}`;
      return `${acc}, ${getMemberNameOrYou(member)}`;
    }, "")} ${membersWhoStillHaveToPay.length === 1 ? "owes" : "owe"} ${
      userIsSucker(user.id, expense.sucker)
        ? "you"
        : getUsernameById(expense.sucker, members)
    } `;
  };

  const getCreator = () => {
    return expense.creator === user.id
      ? "you"
      : getUsernameById(expense.creator, members);
  };

  const getSplitAmount = () => {
    return expense.users
      .filter(
        (member) =>
          member !== expense.sucker && !expense.paidBy.includes(member)
      )
      .reduce(
        (acc, member) => (acc += expense.split[member] * expense.amount),
        0
      );
  };

  const handleDelete = () => {
    try {
      deleteExpenseFromDatabase(id);
      deleteExpenseFromGroup(group, id);
      handleNewActivity();
      setError(null);
      showPopup("Expense Deleted");

      navigate(-1);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [...members],
      type: activityTypes.deletedGroupExpense,
      expenseName: expense.title,
      groupName: group.name
    });
    addNewActivityToDatabase(newActivity);
  };

  if (!expense || !group || !user) return <></>;

  return (
    <main className="expense-detail">
      <BackButton />
      <div className="expense-content">
        <h2 className="title">{expense.title}</h2>
        <GroupListComponent groupID={group.id} />
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
              {userIsSucker(user.id, expense.sucker)
                ? "You"
                : getUsernameById(expense.sucker, members)}{" "}
              paid {expense.currency + addZeros(expense.amount)}
            </p>
            {getSplitAmount() > 0 && (
              <p className="users-who-owe-to-sucker">
                <span className={`${getExpenseColor(userIsSucker())}`}>
                  {getLentOrBorrowed()}
                </span>
                <span
                  className={`${getExpenseColor(userIsSucker())} lent-amount`}
                >
                  {" "}
                  {expense.currency}
                  {addZeros(getSplitAmount())}
                </span>
              </p>
            )}
            <div>
              <div className="individual-settle-wrapper">
                {members
                  .filter(
                    (member) =>
                      member.id !== expense.sucker &&
                      Object.keys(expense.split).includes(member.id)
                  )
                  .map((member) => (
                    <React.Fragment key={member.id}>
                      {!memberHasPaid(member) && (
                        <p>
                          {` ${getMemberNameOrYou(member)}: ${
                            expense.currency
                          }${addZeros(
                            expense.split[member.id] * expense.amount
                          )}`}
                        </p>
                      )}
                      {memberHasPaid(member) && (
                        <p>{` ${getMemberNameOrYou(member)} paid already.`}</p>
                      )}
                      {!memberHasPaid(member) && (
                        <SubmitButton
                          onClick={() => settleMember(member)}
                          disabled={!userIsSucker()}
                          className="btn"
                        >
                          settle
                        </SubmitButton>
                      )}
                      {memberHasPaid(member) && (
                        <SubmitButton
                          onClick={() => unsettleMember(member)}
                          disabled={!userIsSucker()}
                          className="btn"
                        >
                          unsettle
                        </SubmitButton>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
      <ErrorComponent>{error}</ErrorComponent>
      <EditGroupExpenseButton expense={expense} group={group} />
      {!expense.settled && (
        <SubmitButton
          className="settle-btn btn"
          onClick={handleSettleClick}
          disabled={!userIsSucker()}
        >
          settle expense
        </SubmitButton>
      )}
      {expense.settled && (
        <SubmitButton
          className="settle-btn btn"
          onClick={handleUnsettleClick}
          disabled={!userIsSucker()}
        >
          unsettle expense
        </SubmitButton>
      )}
      <SubmitButton
        className="delete-btn bg-purple"
        onClick={() => handleDelete(expense.id)}
        disabled={!userIsSucker()}
      >
        Delete Expense
      </SubmitButton>
    </main>
  );
}

export default GroupExpenseDetail;
