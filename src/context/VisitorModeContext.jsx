import { createContext, useContext, useMemo, useState } from "react";

const VisitorModeContext = createContext(null);

export const VisitorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(null);

  const value = useMemo(
    () => ({
      mode,
      isFriend: mode === "friend",
      selectOwner: () => setMode("owner"),
      selectFriend: () => setMode("friend"),
      resetMode: () => setMode(null),
    }),
    [mode]
  );

  return (
    <VisitorModeContext.Provider value={value}>
      {children}
    </VisitorModeContext.Provider>
  );
};

export const useVisitorMode = () => {
  const ctx = useContext(VisitorModeContext);
  if (!ctx) {
    throw new Error("useVisitorMode must be used inside VisitorModeProvider");
  }
  return ctx;
};

