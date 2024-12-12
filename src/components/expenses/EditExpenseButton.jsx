import useModal from "../../hooks/useModal";
import Modal from "../modals/Modal";
import EditExpenseModal from "./EditExpenseModal";
import { memo } from "react";

function EditExpenseButton({ expense }) {
  const { toggle, isShowing } = useModal();

  return (
    <>
      <button className="edit-btn" onClick={toggle}>
        Edit Expense
      </button>
      {isShowing && (
        <Modal>
          <EditExpenseModal toggleModal={toggle} oldExpense={expense} />
        </Modal>
      )}
    </>
  );
}

export default memo(EditExpenseButton);
