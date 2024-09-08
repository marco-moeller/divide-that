import { memo } from "react";
import usePopup from "../../hooks/usePopup";

function Popup({ children }) {
  const { toggle } = usePopup();

  return (
    <div className="popup" onClick={toggle}>
      {children}
    </div>
  );
}

export default memo(Popup);
