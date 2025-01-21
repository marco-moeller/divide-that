import { useState } from "react";
import { useStatus } from "../../context/StatusContext";

function SubmitButton({ onClick, disabled, children, ...props }) {
  const { status, setStatus, STATUS_TYPES } = useStatus();

  const [showSpinner, setShowSpinner] = useState(false);

  const handleClick = async (event) => {
    if (status !== STATUS_TYPES.IDLE) return;

    try {
      setStatus(STATUS_TYPES.SUBMITTING);
      setShowSpinner(true);
      if (onClick) {
        await onClick(event);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStatus(STATUS_TYPES.IDLE);
      setShowSpinner(false);
    }
  };

  return (
    <button
      {...props}
      disabled={status !== STATUS_TYPES.IDLE || disabled}
      onClick={handleClick}
    >
      {showSpinner ? (
        <>
          <span className="spinner" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default SubmitButton;
