import Image from "next/image";
import styles from "../styles/Home.module.css";
import Navigation from "../Components/Navbar/MyNavbar";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <div className={styles.background}>
      <div className={styles.bigBox}>
        <div className={styles.logoBox}>
          <img
            src="./images/image0.png"
            className={styles.AppLogo}
            alt="logo"
          />
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
      <div className={styles.bigLinks}>
        <a
          href="#"
          className={styles.bigLink}
          onClick={(e) => handleLinkClick(e, "/MintPage")}
          target="_blank"
        >
          Master Key
        </a>
        <a
          href="https://guild.xyz/laelaps-beta#"
          className={styles.bigLink}
          target="_blank"
        >
          Access Here
        </a>
        <a
          href="https://www.youtube.com/watch?v=4H7SeZAb_EM"
          className={styles.bigLink}
          target="_blank"
        >
          Watch Me
        </a>
      </div>
      <br></br>
    </div>
  );
}




