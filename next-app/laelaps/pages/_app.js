import Layout from "../src/app/components/Layout";
import "../src/app/styles/layout.module.css";
import "../src/app/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-container">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
