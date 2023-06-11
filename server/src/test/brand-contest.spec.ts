import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import {
  BrandContest,
  BrandNFT,
  BrandStore,
  KonceptToken,
} from "../typechain-types";

describe("BrandContest", async () => {
  let brandNFT: BrandNFT;
  let brandStore: BrandStore;
  let brandContest: BrandContest;
  let konceptTokens: KonceptToken;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let tokenId: number;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    /**
     * Deploying the KonceptToken Smart Contract
     */
    const konceptTokenFactory = await ethers.getContractFactory(
      "KonceptToken",
      owner
    );
    konceptTokens = await konceptTokenFactory.deploy();
    await konceptTokens.deployed();
    const konAddress = konceptTokens.address;
    /**
     * Deploying the BrandStore Smart Contract
     */
    const brandStoreFactory = await ethers.getContractFactory(
      "BrandStore",
      owner
    );
    brandStore = await brandStoreFactory.deploy();
    await brandStore.deployed();
    const marketAddress = brandStore.address;
    /**
     * Deploying the BrandNFT Smart Contract
     */
    const brandTokenFactory = await ethers.getContractFactory(
      "BrandNFT",
      owner
    );
    brandNFT = await brandTokenFactory.deploy(marketAddress);
    await brandNFT.deployed();
    const brandTokenAddress = brandNFT.address;
    /**
     * Deploying the BrandContest Smart Contract
     */
    const brandContestFactory = await ethers.getContractFactory(
      "BrandContest",
      owner
    );
    brandContest = await brandContestFactory.deploy(
      brandTokenAddress,
      konAddress
    );
    await brandContest.deployed();
    const brandContestAddress = brandContest.address;
  });
  it("should create a contest", async () => {
    let token1 = await brandNFT.createToken("https://www.mytokenlocation.com");
    tokenId = 1;
    const title = "Contest 1";
    const description = "Description 1";
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 86400; // 1 day
    const host = owner;
    const rewardContract = brandNFT.address;

    await brandContest
      .connect(owner)
      .createBrandContest(
        title,
        description,
        startDate,
        endDate,
        rewardContract,
        tokenId
      );

    let activeContests = await brandContest
      .connect(owner)
      .fetchContestsInProgress();

    let humanReadableContests = await Promise.all(
      activeContests.map(async (i): Promise<any> => {
        //const tokenUri = await brandNFT.tokenURI(i.tokenId);
        let contest = {
          contestId: i.contestId.toString(),
          title: i.title.toString(),
          description: i.description.toString(),
          startDate: i.startDate.toString(),
          endDate: i.endDate.toString(),
          host: i.host,
          winner: i.winner,
          tokenContract: i.rewardContract,
          tokenId: i.rewardTokenId,
          ended: i.ended,
        };
        //contestsFromContract.push(contest);
        return contest;
      })
    );
    console.log("humanReadableContests: ", humanReadableContests);

    // const contest = activeContests[0];
    // expect(contest.title).to.equal(title);
    // expect(contest.description).to.equal(description);
    // expect(contest.startDate.toNumber()).to.equal(startDate);
    // expect(contest.endDate.toNumber()).to.equal(endDate);
    // expect(contest.host).to.equal(host);
    // expect(contest.winner).to.equal(ethers.constants.AddressZero);
    // expect(contest.rewardContract).to.equal(rewardContract);
    // expect(contest.rewardTokenId.toNumber()).to.equal(tokenId);
    // expect(contest.ended).to.equal(false);
  });

  // it("should allow users to attend a contest", async () => {
  //   await brandContestContract.connect(user1).attendContest(0);

  //   const attendees = await brandContestContract.getAttendees(
  //     await user1.getAddress()
  //   );

  //   expect(attendees.length).to.equal(1);
  //   expect(attendees[0].toNumber()).to.equal(0);
  // });

  // it("should not allow users to attend the same contest multiple times", async () => {
  //   await expect(
  //     brandContestContract.connect(user1).attendContest(0)
  //   ).to.be.revertedWith("Address has already attended the contest");
  // });

  // it("should end a contest and transfer the NFT to the winner", async () => {
  //   const winner = await user1.getAddress();

  //   await brandContestContract.connect(owner).endContest(0, winner);

  //   const contest = await brandContestContract.getContest(0);

  //   expect(contest.ended).to.equal(true);
  //   expect(contest.winner).to.equal(winner);

  //   const ownerBalance = await brandNFTContract.balanceOf(
  //     await owner.getAddress()
  //   );
  //   const winnerBalance = await brandNFTContract.balanceOf(winner);

  //   expect(ownerBalance.toNumber()).to.equal(0);
  //   expect(winnerBalance.toNumber()).to.equal(1);
  // });
});
