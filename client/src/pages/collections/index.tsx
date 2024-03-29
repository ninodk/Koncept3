import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { testNFTs } from "../../utility/data/testData";
import { useAccount } from "wagmi";
import {
  NftContractAddress,
  ownerAddress,
  storeContractAddress,
} from "../../../../server/src/configurations/config";
import {
  BaseError,
  ContractFunctionRevertedError,
  createWalletClient,
  custom,
  formatEther,
  parseEther,
  parseUnits,
} from "viem";
import { polygonMumbai } from "viem/chains";
import publicClient from "../../utility/viem/client";
// ABIs
import BrandNFTArtifact from "../../../../server/src/artifacts/contracts/BrandNFT.sol/BrandNFT.json";
import BrandStoreArtifact from "../../../../server/src/artifacts/contracts/BrandStore.sol/BrandStore.json";
import { NFTProps } from "../../types/tokenTypes";

const ipfsUrl = process.env.INFURA_IPFS_URL;

const CollectionsPage: React.FC = () => {
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });

  const [NFTs, setNFTs] = useState<NFTProps[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const data = await publicClient.readContract({
      address: storeContractAddress,
      abi: BrandStoreArtifact.abi,
      functionName: "fetchBrandItems",
    });
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await publicClient.readContract({
          address: NftContractAddress,
          abi: BrandNFTArtifact.abi,
          functionName: "tokenURI",
          args: [i.tokenId],
        });

        //const meta = await axios.get(tokenURI);
        const metaUrl = `${ipfsUrl}${tokenURI}`;
        const response = await fetch(metaUrl);
        const meta = await response.json();

        const price = formatEther(i.price);
        let image = (meta.image = `${ipfsUrl}${meta.image}`);

        let item = {
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller.toString(),
          owner: i.owner.toString(),
          image: meta.image,
          name: meta.name,
          description: meta.description,
          contentHash: tokenURI,
          contractPrice: i.price,
        };
        return item;
      })
    );
    setNFTs(items);
    setLoadingState("loaded");
  };

  const buyNFT = async (nft: NFTProps) => {
    if (account && account.isConnected) {
      const walletClient = createWalletClient({
        account: account.address,
        chain: polygonMumbai,
        transport: custom(window.ethereum),
      });

      try {
        const { request } = await publicClient.simulateContract({
          address: storeContractAddress,
          abi: BrandStoreArtifact.abi,
          functionName: "createMarketSale",
          args: [NftContractAddress, nft.tokenId],
          value: nft.contractPrice,
          account: account.address,
          chain: polygonMumbai,
        });
        console.log("request buy NFT: ", request);

        const txHash = await walletClient.writeContract(request);
        console.log(
          `transaction hash of buying the nft with token id ${nft.tokenId}: ${txHash}`
        );

        const confirmations = await publicClient.getTransactionConfirmations({
          hash: txHash,
        });
        loadNFTs();
      } catch (err) {
        if (err instanceof BaseError) {
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            console.log(errorName);
          }
        }
        console.log(err);
      }
    }
  };
  return (
    <div className="w-full max-h-screen">
      <div className="flex justify-start">
        {account.address === ownerAddress && (
          <Link
            href="/collections/create-nft"
            className="px-4 py-1 text-white rounded-full bg-primary hover:bg-slate-800"
          >
            Create NFT
          </Link>
        )}
      </div>
      <span className="relative block mt-4 text-2xl text-slate-800">
        Now Listed
      </span>
      <div className="flex flex-row pt-5 space-x-4">
        {loadingState === "loaded" && NFTs.length ? (
          NFTs.map((nft) => (
            <div
              key={nft.tokenId}
              className="flex flex-col border-2 shadow w-80 rounded-2xl border-primary bg-slate-800"
            >
              <Link
                href={`/collections/NFT/${nft.contentHash}`}
                key={nft.tokenId}
              >
                {nft.image && (
                  <img
                    className="p-3 rounded-3xl"
                    src={nft.image}
                    alt={nft.name}
                  />
                )}
              </Link>
              <div className="pt-2 pb-4 pl-4 pr-4">
                <Link href={`/collections/NFT/${nft.contentHash}`}>
                  <span className="flex mb-2 text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {nft.name}
                  </span>
                </Link>
                <span className="flex mb-3 font-normal text-slate-400">
                  {nft.description}
                </span>

                <div className="flex flex-row justify-between">
                  <button
                    className="justify-self-end px-3 py-0.5 text-white rounded-full bg-primary hover:bg-slate-600"
                    onClick={() => buyNFT(nft)}
                  >
                    Buy
                  </button>
                  <span className="font-semibold justify-self-start text-slate-100">
                    {nft.price} MATIC
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-3xl ">No NFTs yet.</div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
