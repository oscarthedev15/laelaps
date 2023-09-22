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
          Witness the awe-inspiring presence of Laelaps! Descended from the
          divine hounds, this majestic creature possesses unparalleled speed and
          strength, capable of capturing anything it sets its sights on. With
          the agility akin to Hermes and the might of Zeus, Laelaps emerges as
          an unstoppable force. Take heed, for if you find yourself fleeing from
          Laelaps, there is no evading its relentless pursuit.
        </div>
      </div>
      <br></br>
      <div className={styles.bigLinks}>
        <a
          href="#"
          className={styles.bigLink}
          // onClick={(e) => handleLinkClick(e, "/MintPage")}
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
