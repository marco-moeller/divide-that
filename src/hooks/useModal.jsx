import { useState } from "react";

function useModal() {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing((prevState) => !prevState);
  }

  return {
    isShowing,
    toggle
  };
}

export default useModal;
