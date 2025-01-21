import { useStatus } from "../../context/StatusContext";

function SubmitButton({ onClick, disabled, children, ...props }) {
  const { status, setStatus, STATUS_TYPES } = useStatus();

  const handleClick = async (event) => {
    if (status !== STATUS_TYPES.IDLE) return;

    try {
      setStatus(STATUS_TYPES.SUBMITTING);
      if (onClick) {
        await onClick(event);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStatus(STATUS_TYPES.IDLE);
    }
  };

  return (
    <button
      {...props}
      disabled={status !== STATUS_TYPES.IDLE || disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default SubmitButton;
