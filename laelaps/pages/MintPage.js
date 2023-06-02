
import styles from "../styles/MintPage.module.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Utility() {
  return (
    <div className={styles.square}>
      <ConnectWallet />
      <br />
      <div className={styles.gif}>
        <img
          src="https://cloudflare-ipfs.com/ipfs/QmXT48ANVqBHMbCP9kYDtVezh6MqPLPKw95oETKKdxcdA6"
          className={styles.gifImage}
        />
      </div>
      <br />
      <div className={styles.title}>Mint Your Master Key</div>
      <br />

      <div className={styles.textMain}>
        Coming Soon! Every Master Key purchase will automatically trigger a
        purchase of $LAELAPS and immediately burn the purchased tokens.
      </div>
    </div>
  );
}
