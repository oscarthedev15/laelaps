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
          <div className="scrolling-text">
            <p>Laelaps</p>
          </div>
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

        {/* <div className="square">
          <p className="textMain">
            SHXDXW is an Ethereum-based utility token that powers the
            decentralized chat application, acting as the primary medium of
            exchange and interaction within the platform. It allows users to
            access various features, such as sending messages, creating group
            chats, and participating in secure voice calls. By using their
            Ethereum wallets, users can maintain their anonymity while engaging
            in various forms of communication. The decentralized chat
            application harnesses the power of Ethereum's smart contract
            technology and SHXDXW tokens to create a secure and private
            environment for users. Instead of requiring users to pay tokens for
            each communication, the platform simply mandates that users hold a
            specific amount of SHXDXW tokens in their Ethereum wallets to access
            and use the chat application. This approach makes the platform more
            accessible and cost-effective while still maintaining its core
            features and benefits. Once users meet the minimum SHXDXW token
            holding requirement, they can freely communicate with others on the
            platform. The smart contract technology processes each interaction,
            encrypting messages and ensuring complete privacy and security. The
            encrypted messages are then broadcasted to the recipient's Ethereum
            wallet, providing a seamless and secure communication experience.
          </p>
        </div>
        <br></br>
        <div className="square">
          <p className="textMain">
            Total Supply With a finite total supply of 100,000,000 tokens on the
            Ethereum blockchain, SHXDXW is a deflationary cryptocurrency
            designed for long-term growth potential. The team is committed to
            buying back and burning tokens over time, ensuring a continuously
            decreasing supply and increased scarcity. Tax Fee SHXDXW implements
            a 4% tax fee on both buying and selling transactions, ensuring a
            steady source of funding for marketing, development, and strategic
            partnerships. This tax structure supports the project's ongoing
            growth and contributes to its long-term success in the dynamic
            crypto landscape. Token Limits SHXDXW ensures fairness by
            implementing a 2% maximum transaction limit and a 4% maximum wallet
            limit. These measures prevent early investors from dominating the
            supply, promoting a more equitable distribution of tokens for
            participants entering the market around the same time.
          </p>
        </div> */}
      </div>
    );
  }
}
export default App;

