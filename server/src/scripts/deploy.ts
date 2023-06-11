import { ethers } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  /**
   * Storing transaction hashes and the deployer of our contract
   */
  let txHash, txReceipt;
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}\n`);

  /**
   * Deploying the BrandStore Contract
   *    Logging the transaction hash
   */
  const brandStoreFactory = await ethers.getContractFactory("BrandStore");
  const brandStore = await brandStoreFactory.deploy();
  await brandStore.deployed();
  console.log(`The BrandStore Contract is deployed to: ${brandStore.address}`);

  txHash = brandStore.deployTransaction.hash;
  txReceipt = await ethers.provider.waitForTransaction(txHash);
  let txBrandStore = txReceipt.contractAddress;
  console.log(
    `Deployed BrandStore contract with address ${txBrandStore} from transaction.\n`
  );

  /**
   * Deploying the BrandNFT Contract
   */
  const brandNFTFactory = await ethers.getContractFactory("BrandNFT");
  const brandNFT = await brandNFTFactory.deploy(brandStore.address);
  await brandNFT.deployed();
  console.log(`The BrandNFT contract is deployed to: ${brandNFT.address}`);

  txHash = brandNFT.deployTransaction.hash;
  txReceipt = await ethers.provider.waitForTransaction(txHash);
  let txBrandNFT = txReceipt.contractAddress;
  console.log(
    `Deployed BrandNFT contract with address ${txBrandNFT} from transaction.\n`
  );

  /**
   * Deploying the KonceptToken Contract
   */
  const tokenFactory = await ethers.getContractFactory("KonceptToken");
  const konToken = await tokenFactory.deploy();
  await konToken.deployed();
  console.log(`The KonceptToken contract is deployed to: ${konToken.address}`);

  txHash = konToken.deployTransaction.hash;
  txReceipt = await ethers.provider.waitForTransaction(txHash);
  let txKonToken = txReceipt.contractAddress;
  console.log(
    `Deployed BrandNFT contract with address ${txKonToken} from transaction.\n`
  );
  /**
   * Deploying the BrandContest Contract
   */
  const brandContestFactory = await ethers.getContractFactory("BrandContest");
  const brandContest = await brandContestFactory.deploy(
    brandNFT.address,
    konToken.address
  );
  await brandContest.deployed();
  console.log(
    `The BrandContest contract is deployed to: ${brandContest.address}`
  );

  txHash = brandContest.deployTransaction.hash;
  txReceipt = await ethers.provider.waitForTransaction(txHash);
  let txBrandContest = txReceipt.contractAddress;
  console.log(
    `Deployed BrandContest contract with address ${txBrandContest} from transaction.\n`
  );
  /**
   * Deploying the BrandEvent Contract
   */
  const brandEventFactory = await ethers.getContractFactory("BrandEvent");
  const brandEvent = await brandEventFactory.deploy();
  await brandEvent.deployed();
  console.log(`The BrandEvent contract is deployed to: ${brandEvent.address}`);

  txHash = brandEvent.deployTransaction.hash;
  txReceipt = await ethers.provider.waitForTransaction(txHash);
  let txBrandEvent = txReceipt.contractAddress;
  console.log(
    `Deployed BrandEvent Contract with address ${txBrandEvent} from transaction.\n`
  );

  /**
   * Writing the contract addresses and owner/deployer address to a local file
   *    This local file will be used in the client of our app
   */
  writeFileSync(
    "configurations/config.js",
    `
    export const ownerAddress = "${(
      await brandStore.signer.getAddress()
    ).toString()}"
    export const storeContractAddress = "${brandStore.address}"
    export const NftContractAddress = "${brandNFT.address}"
    export const konTokenContractAddress = "${konToken.address}"
    export const contestContractAddress = "${brandContest.address}"
    export const eventContractAddress = "${brandEvent.address}"
    `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
