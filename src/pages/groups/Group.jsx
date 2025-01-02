import { useParams } from "react-router-dom";
import GroupHero from "../../components/groups/GroupHero";
import GroupMember from "../../components/groups/GroupMember";
import { useState } from "react";
import useGroup from "../../hooks/useGroup";
import { nanoid } from "nanoid";
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

function Group() {
  const { id } = useParams();

  const { group } = useGroup(id);
  const { expenses } = useGroupExpenses(group?.expenses);
  const { showPopup } = usePopup();
  const { user } = useAuth();

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
    } catch (error) {
      console.log(error);
    }
  };

  const renderExpenses = () => {
    let currentMonth = null;

    return expenses.map((expense) => {
      if (currentMonth !== expense.date.toDate().getMonth()) {
        currentMonth = expense.date.toDate().getMonth();
        return (
          <div key={nanoid()}>
            <p className="expense">
              {convertToMonthYear(expense.date.toDate())}
            </p>
            <GroupExpense expense={expense} />
          </div>
        );
      } else {
        return (
          <div key={nanoid()}>
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
              <div className="" key={userID}>
                <GroupMember
                  userID={userID}
                  getSelectedMemberClass={getSelectedMemberClass}
                  setSelectedMember={setSelectedMember}
                />
              </div>
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
              <button
                className="bg-purple purple-btn"
                onClick={handleSettleClick}
                disabled={totalGroupDebtInDefaultCurrency === "0.00"}
              >
                settle up
              </button>
            </section>
          </>
        )}
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

export default Group;
