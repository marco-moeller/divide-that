import { useParams } from "react-router-dom";
import GroupHero from "../../components/groups/GroupHero";
import GroupMember from "../../components/groups/GroupMember";
import { memo, useState } from "react";
import useGroup from "../../hooks/useGroup";
import NoExpenses from "../../components/expenses/NoExpenses";
import GroupUserSearch from "../../components/groups/GroupUserSearch";
import AddGroupExpenseButton from "../../components/groups/expenses/AddGroupExpenseButton";
import GroupExpense from "../../components/groups/expenses/GroupExpense";
import GroupDebtInfo from "../../components/groups/GroupDebtInfo";
import useGroupExpenses from "../../hooks/useGroupExpenses";
import { addExpenseToDatabase } from "../../database/expenses";
import { usePopup } from "../../context/PopupContext";
import { getUserFromDatabase } from "../../database/user";
import { useAuth } from "../../context/AuthContext";
import { convertToMonthYear } from "../../utility/date";
import useTotalGroupDebt from "../../hooks/useTotalGroupDebt";
import useTotalGroupDebtInDefaultCurrency from "../../hooks/useTotalGroupDebtInDefaultCurrency";
import ErrorComponent from "../../components/error/ErrorComponent";
import useError from "../../components/error/useError";
import SubmitButton from "../../components/layout/SubmitButton";

function Group() {
  const { id } = useParams();

  const { group } = useGroup(id);
  const { expenses } = useGroupExpenses(group?.expenses);
  const { showPopup } = usePopup();
  const { user } = useAuth();
  const { error, setError } = useError();

  const [selectedMember, setSelectedMember] = useState(null);
  const { totalDebt } = useTotalGroupDebt(selectedMember, expenses);
  const { totalGroupDebtInDefaultCurrency } =
    useTotalGroupDebtInDefaultCurrency(totalDebt || 0);

  const getSelectedMemberClass = (userID) => {
    return userID === selectedMember ? "selected" : "";
  };

  const handleSettleClick = async () => {
    //for each expense that you paid add selectedMember to paidBy
    try {
      expenses
        .filter((expense) => expense.sucker === user.id)
        .forEach(async (expense) => {
          await addExpenseToDatabase({
            ...expense,
            paidBy: [...expense.paidBy, selectedMember]
          });
        });
      //for each expense that selected member paid, add yourself to paidBy

      expenses
        .filter((expense) => expense.sucker === selectedMember)
        .forEach(async (expense) => {
          await addExpenseToDatabase({
            ...expense,
            paidBy: [...expense.paidBy, user.id]
          });
        });

      const selectedUser = await getUserFromDatabase(selectedMember);
      showPopup(`You settled all expenses with ${selectedUser.userName}`);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const renderExpenses = () => {
    let currentMonth = null;

    return expenses.map((expense) => {
      if (currentMonth !== expense.date.toDate().getMonth()) {
        currentMonth = expense.date.toDate().getMonth();
        return (
          <div key={expense.id}>
            <p className="expense">
              {convertToMonthYear(expense.date.toDate())}
            </p>
            <GroupExpense expense={expense} />
          </div>
        );
      } else {
        return (
          <div key={expense.id}>
            <GroupExpense expense={expense} />
          </div>
        );
      }
    });
  };

  if (!group || !expenses) return;

  return (
    <>
      <GroupHero group={group} />
      <main className="group">
        <section className="members scrollable-x scrollable">
          {[user.id, ...group.users.filter((member) => member !== user.id)].map(
            (userID) => (
              <GroupMember
                key={userID}
                userID={userID}
                getSelectedMemberClass={getSelectedMemberClass}
                setSelectedMember={setSelectedMember}
              />
            )
          )}
        </section>

        {selectedMember && (
          <>
            <GroupDebtInfo
              expenses={expenses}
              selectedMember={selectedMember}
            />{" "}
            <section className="control-btns">
              <SubmitButton
                className="bg-purple purple-btn"
                onClick={handleSettleClick}
                disabled={totalGroupDebtInDefaultCurrency === "0.00"}
              >
                settle up
              </SubmitButton>
            </section>
          </>
        )}
        <ErrorComponent>{error}</ErrorComponent>
        <GroupUserSearch group={group} />

        <section className="expenses">
          {group.expenses.length === 0 && <NoExpenses />}
          {group.expenses.length > 0 && renderExpenses()}
        </section>
        {group.users.length > 1 && <AddGroupExpenseButton />}
      </main>
    </>
  );
}

export default memo(Group);
