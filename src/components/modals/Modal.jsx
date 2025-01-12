import { useEffect } from "react";

function Modal({ children }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = "unset");
  }, []);

  return <section className="modal">{children}</section>;
}

export default Modal;
