import Image from "next/image";
import styles from "../src/app/styles/page.module.css";
import Navigation from "../src/app/components/Navbar/MyNavbar";

export default function Home() {
  return (
    <div className={styles.background}>
      <div className={styles.bigBox}>
        <div className={styles.logoBox}>
          <img src="./images/logo.PNG" className={styles.AppLogo} alt="logo" />
        </div>
      </div>
      <div className={styles.bigBox}>
        <div className={styles.title}>Laelaps</div>
      </div>
      <div className={styles.access}></div>
      <div className={styles.square}>
        <div className={styles.textMain}>
          Behold, the mighty Laelaps! Descended from the hounds of the gods,
          this magnificent creature has the speed and strength to catch anything
          it pursues. With the agility of Hermes and the power of Zeus, Laelaps
          is a force to be reckoned with. So beware, for if you find yourself on
          the run from Laelaps, there is no escape from its unrelenting pursuit.
        </div>
      </div>
      <br></br>
      <br></br>
    </div>
  );
}
