import { IoMdClose } from "react-icons/io";
import { useStatus } from "../../context/StatusContext";

function ModalHeader({ children, toggleModal, handleSubmit }) {
  const { status } = useStatus();

  return (
    <header className="modal-header-wrapper">
      <div className="modal-header">
        <button className="back-btn" onClick={toggleModal}>
          <IoMdClose />
        </button>
        <h1>{children}</h1>
        {!handleSubmit && <div className="save-btn"></div>}
        {handleSubmit && (
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={status !== "idle"}
          >
            save
          </button>
        )}
      </div>
    </header>
  );
}

export default ModalHeader;
