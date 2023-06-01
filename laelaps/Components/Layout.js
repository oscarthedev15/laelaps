import Navbar from "./Navbar/MyNavbar";
import styles from "../styles/layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      {children}
    </div>
  );
}
