import { MdAddCard } from "react-icons/md";
import useModal from "../../hooks/useModal";
import Modal from "../modals/Modal";
import AddExpenseModal from "./AddExpenseModal";
import { memo } from "react";

function AddExpenseButton() {
  const { toggle, isShowing } = useModal();

  return (
    <>
      <button className="add-expense" onClick={toggle}>
        <MdAddCard /> add expense
      </button>
      {isShowing && (
        <Modal>
          <AddExpenseModal toggleModal={toggle} />
        </Modal>
      )}
    </>
  );
}

export default memo(AddExpenseButton);
