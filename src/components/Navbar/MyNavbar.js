import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navigation = () => {
    return (
      <div className="container">
        <button className="button">Home</button>
        <button className="button">Chart</button>
        <button className="button">Contact</button>
        <button className="button">Telegram</button>
      </div>
    );
};

export default Navigation;
