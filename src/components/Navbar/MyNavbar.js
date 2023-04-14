import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import React from "react";


const Navigation = () => {
    function utilityClick() {
          document
            .getElementById("utility")
            .scrollIntoView({ behavior: "smooth" });
    }


    return (
      <div className="container">
        <button className="button">Home</button>
        <button className="button">Chart</button>
        <button className="button" onClick={utilityClick}>Utility</button>
        <button className="button">Telegram</button>
        <button className="button">DAO</button>
      </div>
    );
};

export default Navigation;
