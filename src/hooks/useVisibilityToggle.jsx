import { useState } from "react";

function useVisibilityToggle() {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    setIsShowing((prevState) => !prevState);
  };

  return { isShowing, toggle };
}

export default useVisibilityToggle;
