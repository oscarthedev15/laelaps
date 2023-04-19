import "./utility.css";
import React from "react";
import Navigation from "../components/Navbar/MyNavbar";

class Utility extends React.Component {
  render() {
    return (
      <div className="background">
        <div>
          <Navigation />
        </div>

        <div className="d-flex justify-content-center">
          <div className="title">Utility</div>
        </div>
        <div className="square">
          <p className="textMain">
            Laelaps is a project focused on optimizing users experience on the
            blockchain. Through collecting and simplifying data, Laelaps is the
            dog that thrives and improves as you fine tune your own methods with
            him.
          </p>
        </div>

        <br></br>
      </div>
    );
  }
}
export default Utility;
