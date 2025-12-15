import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { VisitorModeContext } from "./useVisitorMode";

export const VisitorModeProvider = (props) => {
  const { children } = props;
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

VisitorModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
