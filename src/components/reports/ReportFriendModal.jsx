import ModalBody from "../modals/ModalBody";
import Modal from "../modals/Modal";
import { useState } from "react";
import { getNewReport } from "../../utility/interfaces";
import { addReportToDatabase } from "../../database/reports";
import useError from "../error/useError";
import ErrorComponent from "../error/ErrorComponent";
import { IoMdArrowRoundDown, IoMdClose } from "react-icons/io";
import { usePopup } from "../../context/PopupContext";

function ReportFriendModal({ userID, friendID, toggle }) {
  const [reportDisc, setReportDisc] = useState("");
  const { error, setError } = useError();
  const { showPopup } = usePopup();

  const handleChange = (event) => {
    const { value } = event.target;
    setReportDisc(value);
  };

  const handleSubmit = async () => {
    try {
      if (reportDisc === "") {
        throw new Error("Your report can't be empty.");
      }
      toggle();
      const newReport = getNewReport(userID, friendID, reportDisc);
      await addReportToDatabase(newReport);
      showPopup("User Reported");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="report-friend-form">
      <Modal>
        <ModalBody>
          <IoMdClose onClick={toggle} />
          <p className="find-your-friends-below">
            write your <span className="red">&nbsp;report&nbsp; </span> below{" "}
            <IoMdArrowRoundDown />
          </p>
          <textarea
            type="text"
            name="reportDisc"
            id="reportDisc"
            placeholder="Discribe your issue..."
            maxlength="500"
            value={reportDisc}
            onChange={handleChange}
            required
          />
          <ErrorComponent>{error}</ErrorComponent>
          <button onClick={handleSubmit} className="btn">
            submit
          </button>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ReportFriendModal;
