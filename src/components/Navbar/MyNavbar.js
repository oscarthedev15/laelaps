import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import React from "react";
import { Link } from "react-router-dom";


const Navigation = () => {
  

    return (
      <div className="container">
        <button className="button">Home</button>
        <button className="button">Chart</button>
        {/* <button className="button">Utility</button> */}
        <Link to="/utility" className="button">
          Utility
        </Link>
        <button className="button">Telegram</button>
        <button className="button">DAO</button>
      </div>
    );
};

export default Navigation;
