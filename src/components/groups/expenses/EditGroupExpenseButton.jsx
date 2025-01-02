import useModal from "../../../hooks/useModal";
import Modal from "../../modals/Modal";
import EditGroupExpenseModal from "./EditGroupExpenseModal";
import { memo } from "react";

function EditGroupExpenseButton({ expense, group }) {
  const { toggle, isShowing } = useModal();
  return (
    <>
      <button className="edit-btn btn" onClick={toggle}>
        Edit Expense
      </button>
      {isShowing && (
        <Modal>
          <EditGroupExpenseModal
            toggleModal={toggle}
            oldExpense={expense}
            group={group}
          />
        </Modal>
      )}
    </>
  );
}

export default memo(EditGroupExpenseButton);
