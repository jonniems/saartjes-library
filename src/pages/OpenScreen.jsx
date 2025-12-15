import "./OpenScreen.css";
import { useEffect } from "react";
import { useVisitorMode } from "../context/useVisitorMode.js";
import Logo from "../assets/icons/logo.png";

const OpenScreen = () => {
  const { selectOwner, selectFriend } = useVisitorMode();

  useEffect(() => {
    document.body.classList.add("open-screen-body");
    return () => {
      document.body.classList.remove("open-screen-body");
    };
  }, []);

  return (
    <div className="open-screen">
      <div className="open-screen-top">
        <img
          src={Logo}
          alt="Saartje's Library logo"
          className="open-screen-logo"
        />
        <h1 className="open-screen-title">Saartje&apos;s Library</h1>
      </div>
      <div className="open-screen-actions">
        <button className="open-screen-primary" onClick={selectOwner}>
          Saartje&apos;s Entrance
        </button>
        <button className="open-screen-link" onClick={selectFriend}>
          Entrance for friends
        </button>
      </div>
    </div>
  );
};

export default OpenScreen;
