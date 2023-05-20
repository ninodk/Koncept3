import Head from "next/head";
import Navigation from "./Navigation";
import styles from "../../styles/Home.module.css";

const Header: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Koncept3</title>
        <meta
          name="description"
          content="Koncept3. Connect your brand with me!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation></Navigation>
    </div>
  );
};
export default Header;
