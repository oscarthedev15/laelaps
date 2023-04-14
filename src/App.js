import "./App.css";
import React from "react";
import Navigation from "./components/Navbar/MyNavbar";


class App extends React.Component {
  render() {
    return (
      <div className="background">
        <div>
          <Navigation />
        </div>
        <div className="d-flex justify-content-center">
          <div className="logoBox">
            <img
              src="https://i.imgur.com/GiEaH0F.png"
              className="App-logo"
              alt="logo"
            />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="title">Laelaps</div>
        </div>
        <div className="access">
          <a href="https://www.example.com" className="access">
            Access services here
          </a>
        </div>
        <div className="square">
          <p className="textMain">
            Behold, the mighty Laelaps! Descended from the hounds of the gods,
            this magnificent creature has the speed and strength to catch
            anything it pursues. With the agility of Hermes and the power of
            Zeus, Laelaps is a force to be reckoned with. So beware, for if you
            find yourself on the run from Laelaps, there is no escape from its
            unrelenting pursuit.
          </p>
        </div>
        <br></br>
        <div className="square">
          <p className="textMain">
            <div id="utility" className="access">
              Utility
            </div>
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
export default App;

