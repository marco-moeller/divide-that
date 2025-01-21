import { createContext, useContext, useState } from "react";

export const StatusContext = createContext();

export function useStatus() {
  return useContext(StatusContext);
}

const STATUS_TYPES = {
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error",
  VALIDATION_ERROR: "validationError",
  CANCELLED: "cancelled",
  RETRYING: "retrying"
};

export function StatusProvider({ children }) {
  const [status, setStatus] = useState("idle");

  const value = { status, setStatus, STATUS_TYPES };

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
}
