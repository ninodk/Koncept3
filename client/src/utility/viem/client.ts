import { PublicClient, createPublicClient, getContract, http } from "viem";
import {
  mainnet,
  hardhat,
  localhost,
  polygon,
  polygonMumbai,
} from "viem/chains";

// Import API keys
const projectId = process.env.INFURA_API_KEY;
const env = process.env.NEXT_PUBLIC_ENVIRONMENT;

let publicClient: PublicClient;
if (process.env.NEXT_PUBLIC_ENVIRONMENT === "local") {
  publicClient = createPublicClient({
    chain: localhost,
    transport: http(),
  });
} else if (process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet") {
  publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(`https://polygon-mumbai.infura.io/v3/${projectId}`),
  });
} else {
  publicClient = createPublicClient({
    chain: polygon,
    transport: http(`https://polygon-mainnet.infura.io/v3/${projectId}`),
  });
}
export default publicClient;
