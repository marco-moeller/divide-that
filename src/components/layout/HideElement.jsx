import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

function HideElement({ children }) {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    setIsShowing((prevState) => !prevState);
  };

  return (
    <>
      <p onClick={toggle} className="hide-arrows">
        {!isShowing && <MdKeyboardArrowDown />}
        {isShowing && <MdOutlineKeyboardArrowUp />}
      </p>
      {isShowing && (
        <div className="hide-element">
          {" "}
          <div className="divider"></div>
          {children}
        </div>
      )}
    </>
  );
}

export default HideElement;
