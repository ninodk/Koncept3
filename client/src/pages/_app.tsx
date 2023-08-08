import PageLayout from "../components/Layout/PageLayout";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
/* Local file Imports */
import { ownerAddress } from "../../../server/src/configurations/config";

/* Web3Modal Imports */
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
/* Wagmi Imports */
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  hardhat,
  localhost,
  mainnet,
  polygon,
  polygonMumbai,
} from "wagmi/chains";
// Hooks
import { useAccount } from "wagmi";

//  RPC Providers
//import { infuraProvider } from "wagmi/providers/infura";
//import { publicProvider } from "wagmi/providers/public";
import Web3ModalButton from "../components/WalletConnect/Web3ModalButton";

const chains = [mainnet, polygon, polygonMumbai, hardhat, localhost];

// 1. Get projectID
//  at https://cloud.walletconnect.com
//  or at other RPCs like Infura
if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  throw new Error("You need to provide a projectId");
}
const projectId = process.env.WALLET_CONNECT_PROJECT_ID;
console.log("project id from wallet connect: ", projectId);

// 2. Configure wagmi client
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> component
function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  //const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </WagmiConfig>
      ) : null}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </div>
  );
}

export default MyApp;
