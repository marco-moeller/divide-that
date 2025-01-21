import { IoMdClose } from "react-icons/io";
import SubmitButton from "../layout/SubmitButton";

function ModalHeader({ children, toggleModal, handleSubmit }) {
  return (
    <header className="modal-header-wrapper">
      <div className="modal-header">
        {!handleSubmit && <div className="save-btn"></div>}
        {handleSubmit && (
          <SubmitButton className="save-btn" onClick={handleSubmit}>
            save
          </SubmitButton>
        )}
        <h1>{children}</h1>
        <button className="back-btn" onClick={toggleModal}>
          <IoMdClose />
        </button>
      </div>
    </header>
  );
}

export default ModalHeader;
