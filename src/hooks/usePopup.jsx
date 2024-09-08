import { useEffect, useState } from "react";

function usePopup() {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing((prevState) => !prevState);
  }

  useEffect(() => {
    let timeout;
    if (isShowing) {
      timeout = setTimeout(() => {
        toggle();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [isShowing]);

  return {
    isShowing,
    toggle
  };
}

export default usePopup;
