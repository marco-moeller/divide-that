import { createContext, useContext, useState } from "react";

export const StatusContext = createContext();

export function useStatus() {
  return useContext(StatusContext);
}

export function StatusProvider({ children }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const value = { status, setStatus, error, setError };

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
}
