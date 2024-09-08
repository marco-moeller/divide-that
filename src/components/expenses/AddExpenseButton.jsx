import { MdAddCard } from "react-icons/md";
import useModal from "../../hooks/useModal";
import usePopup from "../../hooks/usePopup";
import Modal from "../modals/Modal";
import AddExpenseModal from "./AddExpenseModal";
import Popup from "../popups/Popup";
import { memo } from "react";

function AddExpenseButton() {
  const { toggle, isShowing } = useModal();

  const {
    toggle: toggleAddExpensePopup,
    isShowing: isShowingExpenseAddedPopup
  } = usePopup();

  return (
    <>
      <button className="add-expense" onClick={toggle}>
        <MdAddCard /> add expense
      </button>
      {isShowing && (
        <Modal>
          <AddExpenseModal
            toggleModal={toggle}
            toggleAddExpensePopup={toggleAddExpensePopup}
          />
        </Modal>
      )}
      {isShowingExpenseAddedPopup && <Popup>Expense Added</Popup>}
    </>
  );
}

export default memo(AddExpenseButton);
