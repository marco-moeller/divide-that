import { IoMdClose } from "react-icons/io";
import { useStatus } from "../../context/StatusContext";

function ModalHeader({ children, toggleModal, handleSubmit }) {
  const { status } = useStatus();

  return (
    <header className="modal-header-wrapper">
      <div className="modal-header">
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
        <h1>{children}</h1>
        <button className="back-btn" onClick={toggleModal}>
          <IoMdClose />
        </button>
      </div>
    </header>
  );
}

export default ModalHeader;
