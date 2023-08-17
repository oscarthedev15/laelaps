import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Layout from "../Components/Layout";
import styles from "../styles/layout.module.css";
import Head from "next/head";


// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT}
    >
      <Head>
        <title>Laelaps</title>
        <link rel="icon" href="/images/image0.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  );
}

export default MyApp;
