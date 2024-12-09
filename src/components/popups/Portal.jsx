import ReactDOM from "react-dom";

function Portal({ children }) {
  return ReactDOM.createPortal(
    children,
    document.getElementById("portal-root")
  );
}

export default Portal;
