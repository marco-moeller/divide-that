import { memo } from "react";
import "./popup.css";
import Portal from "./Portal";
import { usePopup } from "../../context/PopupContext";

function Popup() {
  const { popup, hidePopup } = usePopup();

  return (
    popup.visible && (
      <Portal>
        <div className="popup" onClick={hidePopup}>
          {popup.message}
        </div>
      </Portal>
    )
  );
}

export default memo(Popup);
