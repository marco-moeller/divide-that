import { MdAddCard } from "react-icons/md";
import { memo } from "react";
import AddGroupExpenseModal from "./AddGroupExpenseModal";
import Modal from "../../modals/Modal";
import useModal from "../../../hooks/useModal";

function AddGroupExpenseButton() {
  const { toggle, isShowing } = useModal();

  return (
    <>
      <button className="add-expense" onClick={toggle}>
        <MdAddCard /> add group expense
      </button>
      {isShowing && (
        <Modal>
          <AddGroupExpenseModal toggleModal={toggle} />
        </Modal>
      )}
    </>
  );
}

export default memo(AddGroupExpenseButton);
