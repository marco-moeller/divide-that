import { useEffect, useState } from "react";
import AddExpenseModal from "../components/AddExpenseModal";
import { addZeros } from "../utility/money";
import { nanoid } from "nanoid";
import { deleteExpenseFromDatabase, expensesRef } from "../database/firebase";
import { onSnapshot } from "firebase/firestore";
import { MdAddCard } from "react-icons/md";
import Hero from "../components/Hero";
import Modal from "../components/Modal";
import { convertToLocaleDate } from "../utility/date";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import EditExpenseModal from "../components/EditExpenseModal";

function Homepage() {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [expensesList, setExpensesList] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);

  const toggleAddExpenseModal = () => {
    setShowAddExpenseModal((prevState) => !prevState);
  };

  const toggleEditExpenseModal = (expense) => {
    setCurrentExpense(expense);
    setShowEditExpenseModal((prevState) => !prevState);
  };

  const handleDelete = (title) => {
    deleteExpenseFromDatabase(title);
  };

  useEffect(() => {
    onSnapshot(expensesRef, (snapshot) => {
      let expensesList = [];
      snapshot.docs.forEach((doc) => expensesList.push(doc.data()));
      setExpensesList(expensesList.sort((a, b) => b.date - a.date));
    });
  }, []);

  return (
    <>
      <Hero />
      <main>
        <section className="control-btns">
          <button className="bg-orange">settle up</button>
          <button>remind....</button>
          <button>charts</button>
        </section>
        <section className="expenses">
          {expensesList?.map((expense) => (
            <div className="expense" key={nanoid()}>
              <h3 className="date">
                {convertToLocaleDate(expense.date.toDate())}
              </h3>
              <div className="title-container">
                <h2 className="title">{expense.title}</h2>
                <p className="subtitle">
                  {expense.payer} paid{" "}
                  {expense.currency + addZeros(expense.amount)}
                </p>
              </div>
              <div className="right-col green">
                <span>{expense.payer} lent</span>
                <span className="lent-amount">
                  {" "}
                  {expense.currency}
                  {addZeros(expense.amount * expense.split)}
                </span>
              </div>
              <div
                className="delete-btn"
                onClick={() => handleDelete(expense.id)}
              >
                <MdDeleteOutline />
              </div>
              <div
                className="edit-btn"
                onClick={() => toggleEditExpenseModal(expense)}
              >
                <FaRegEdit />
              </div>
            </div>
          ))}
        </section>
        <button className="add-expense" onClick={toggleAddExpenseModal}>
          <MdAddCard /> add expense
        </button>
      </main>
      {showAddExpenseModal && (
        <Modal>
          <AddExpenseModal toggleModal={toggleAddExpenseModal} />
        </Modal>
      )}
      {showEditExpenseModal && (
        <Modal>
          <EditExpenseModal
            toggleModal={toggleEditExpenseModal}
            oldExpense={currentExpense}
          />
        </Modal>
      )}
    </>
  );
}

export default Homepage;
