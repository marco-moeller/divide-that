import { createContext, useContext, useState } from "react";

export const PopupContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState({ message: "", visible: false });

  const showPopup = (message) => {
    setPopup({ message: message, visible: true });
    setTimeout(() => setPopup({ message: "", visible: false }), 3000);
  };

  const hidePopup = () => {
    setPopup((prevState) => ({ ...prevState, visible: false }));
  };

  const value = { popup, showPopup, hidePopup };

  return (
    <PopupContext.Provider value={value}>{children}</PopupContext.Provider>
  );
}
