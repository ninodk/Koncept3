import PageLayout from "../components/Layout/PageLayout";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="wagmi-config">
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </div>
  );
}

export default MyApp;
