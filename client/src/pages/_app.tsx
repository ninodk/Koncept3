import PageLayout from "../components/Layout/PageLayout";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="w-full h-full overflow-hidden">
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </div>
  );
}

export default MyApp;
