import { FaRegEdit } from "react-icons/fa";
import useModal from "../../hooks/useModal";
import usePopup from "../../hooks/usePopup";
import Modal from "../modals/Modal";
import EditExpenseModal from "./EditExpenseModal";
import Popup from "../popups/Popup";
import { memo } from "react";

function EditExpenseButton({ expense }) {
  const { toggle, isShowing } = useModal();

  const {
    toggle: toggleEditExpensePopup,
    isShowing: isShowingExpenseEditedPopup
  } = usePopup();

  return (
    <>
      <div className="edit-btn" onClick={toggle}>
        <FaRegEdit />
      </div>
      {isShowing && (
        <Modal>
          <EditExpenseModal
            toggleModal={toggle}
            oldExpense={expense}
            toggleEditExpensePopup={toggleEditExpensePopup}
          />
        </Modal>
      )}
      {isShowingExpenseEditedPopup && <Popup>Expense Updated</Popup>}
    </>
  );
}

export default memo(EditExpenseButton);
