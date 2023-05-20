import * as dotenv from "dotenv";
dotenv.config({
  path: `../.env`,
});

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { readFileSync } from "fs";

const privateKey = readFileSync(".secret").toString();
const projectId = process.env.INFURA_API_KEY;

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey],
    },
    polygon_mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey], //Accounts from which we are deploying our contracts
    },
  },
  solidity: "0.8.18",
};

export default config;
