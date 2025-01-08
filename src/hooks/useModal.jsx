import { useState } from "react";
import { useStatus } from "../context/StatusContext";

function useModal() {
  const { setError } = useStatus();

  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing((prevState) => !prevState);
    setError(null);
  }

  return {
    isShowing,
    toggle
  };
}

export default useModal;
