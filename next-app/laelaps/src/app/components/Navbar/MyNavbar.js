import "./Navbar.css";
import React from "react";
import { useRouter } from "next/router";

const Navigation = () => {
  const router = useRouter();
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <div className="container">
      <a href="#" className="button" onClick={(e) => handleLinkClick(e, "/")}>
        Home
      </a>
      <a
        href="#"
        className="button"
        onClick={(e) => handleLinkClick(e, "/Utility")}
        target="_blank"
      >
        Utility
      </a>
      <a
        href="https://www.dextools.io/app/ether/pair-explorer/0x811a10657440928c9cda3580eb54f271ac4b9a19?_sm_nck=1"
        className="button"
        target="_blank"
      >
        Chart
      </a>
      <a href="https://t.me/LaelapsPortal" className="button" target="_blank">
        Telegram
      </a>
      <a
        href="https://twitter.com/LaelapsBot"
        className="button"
        target="_blank"
      >
        Twitter
      </a>
      <a
        href="https://medium.com/@LaelapsBot"
        className="button"
        target="_blank"
      >
        Medium
      </a>
    </div>
  );
};

export default Navigation;
