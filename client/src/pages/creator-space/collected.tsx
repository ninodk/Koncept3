import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NFTProps } from "../../types/tokenTypes";
import {
  NftContractAddress,
  ownerAddress,
  storeContractAddress,
} from "../../../../server/src/configurations/config";
import { createWalletClient, custom, formatEther } from "viem";
import { polygonMumbai } from "viem/chains";
import publicClient from "../../utility/viem/client";
// ABIs
import BrandNFTArtifact from "../../../../server/src/artifacts/contracts/BrandNFT.sol/BrandNFT.json";
import BrandStoreArtifact from "../../../../server/src/artifacts/contracts/BrandStore.sol/BrandStore.json";
import Link from "next/link";
const ipfsUrl = process.env.INFURA_IPFS_URL;

const Collected: React.FC = ({ children }: { children: React.ReactNode }) => {
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });
  const router = useRouter();
  const [CollectedNFTs, setCollectedNFTs] = useState<NFTProps[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadCollectedNFTs();
  });

  const loadCollectedNFTs = async () => {
    // const [account] = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    const walletClient = createWalletClient({
      account: account.address,
      chain: polygonMumbai,
      transport: custom(window.ethereum),
    });

    const data = await publicClient.readContract({
      address: storeContractAddress,
      abi: BrandStoreArtifact.abi,
      functionName: "fetchMyNFTs",
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
        };
        return item;
      })
    );
    setCollectedNFTs(items);
    setLoadingState("loaded");
  };
  return (
    <div className="w-full max-h-screen">
      <div className="flex flex-row pt-5 space-x-4">
        {loadingState === "loaded" && CollectedNFTs.length ? (
          CollectedNFTs.map((nft) => (
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
                  <button className="justify-self-end px-3 py-0.5 text-white rounded-full bg-primary hover:bg-slate-600">
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
          <div className="text-3xl ">No NFTs owned yet. Buy some!</div>
        )}
      </div>
    </div>
  );
};
export default Collected;
