
import styles from "../styles/MintPage.module.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Utility() {
  return (
    
      <div className={styles.square}>
        <ConnectWallet />
        <br />
        <div className={styles.title}>Mint Your Master Key</div>
        <br />

        <div className={styles.textMain}>
          Masterkey blah Masterkey blahMasterkey blah Masterkey blah Masterkey
          blah Masterkey blah Masterkey blah Masterkey blah Masterkey blah{" "}
          Masterkey blah
        </div>
      </div>
  );
}
