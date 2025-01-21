import { useStatus } from "../context/StatusContext";

export function useHandleSubmitWrapper() {
  const { status, setStatus, STATUS_TYPES } = useStatus();

  const handleSubmitWrapper = (submitFunction) => {
    if (status !== STATUS_TYPES.IDLE) return;

    return async (...args) => {
      setStatus(STATUS_TYPES.SUBMITTING);
      await submitFunction(...args);
      setStatus(STATUS_TYPES.IDLE);
    };
  };

  return handleSubmitWrapper;
}
