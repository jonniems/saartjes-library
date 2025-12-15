import { createContext, useContext } from "react";

export const VisitorModeContext = createContext(null);

export const useVisitorMode = () => {
  const ctx = useContext(VisitorModeContext);
  if (!ctx) {
    throw new Error("useVisitorMode must be used inside VisitorModeProvider");
  }
  return ctx;
};


