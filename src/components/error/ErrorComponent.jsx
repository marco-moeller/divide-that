function ErrorComponent({ children }) {
  return <>{children && <p className="error"> {children}</p>}</>;
}

export default ErrorComponent;
