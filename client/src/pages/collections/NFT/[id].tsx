import { useRouter } from "next/router";
import SingleNFT from "./SingleNFT";
import { useAccount } from "wagmi";
import Head from "next/head";
import TraitBox from "../../../components/Traits/TraitBox";
import { GetStaticPaths, GetStaticProps } from "next";
import publicClient from "../../../utility/viem/client";
import { createWalletClient, custom, formatEther } from "viem";
import { polygonMumbai } from "viem/chains";
import {
  NftContractAddress,
  ownerAddress,
  storeContractAddress,
} from "../../../../../server/src/configurations/config";
// ABIs
import BrandNFTArtifact from "../../../../../server/src/artifacts/contracts/BrandNFT.sol/BrandNFT.json";
import BrandStoreArtifact from "../../../../../server/src/artifacts/contracts/BrandStore.sol/BrandStore.json";
import { useState } from "react";
const ipfsUrl = process.env.INFURA_IPFS_URL;

const NFT: React.FC = ({
  nft,
}: {
  nft: {
    price: string;
    tokenId: string;
    seller: string;
    owner: string;
    image: string;
    name: string;
    description: string;
    contentHash: string;
  };
}) => {
  const [NFTs, setNFTs] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });
  /**
   * Fallback route
   *    When we run a build and someone creates a new NFT, and we want to continue to fetch the new NFTs
   *    Fallback route recognizes that the new NFT has not been part of the build and then it will fetch data until it gets returned
   */
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full align-center max-w-screen">
      {nft && account.isConnected && account.address === ownerAddress && (
        <div>
          <Head>
            <title>{nft.name} NFT</title>
          </Head>
          <div className="w-full max-w-full">
            <div className="flex flex-row gap-2">
              <div className="relative mt-5 mb-5 mr-5 overflow-hidden max-w-1/2 w-max">
                <img
                  src={nft.image}
                  className="border-2 border-solid rounded-lg border-primary"
                  width={512}
                  height={512}
                  alt="NFT Image"
                ></img>
              </div>
              <div className="flex flex-col w-1/2 mt-5 mb-5 mr-5 overflow-hidden max-w-1/2">
                <div className="flex flex-row justify-between">
                  <div className="text-3xl font-semibold text-slate-800">
                    {nft.name}
                  </div>
                  <div className="flex place-content-end">
                    <button className="px-4 py-1 text-white rounded-full bg-primary hover:bg-slate-900">
                      Buy
                    </button>
                  </div>
                </div>
                <div className="flex flex-row">
                  <p className="space-x-2">
                    <span className="text-slate-900">Owned by</span>
                    <span className="text-primary">{nft.owner}</span>
                  </p>
                </div>
                <div className="w-full mt-3">
                  <p className="text-xs tracking-wider uppercase text-slate-900">
                    <span>price</span>
                  </p>
                  <p className="text-xl font-medium tracking-wide uppercase text-primary">
                    <span>{nft.price} MATIC</span>
                  </p>
                </div>
                <div className="w-full mt-3">
                  <p className="text-xs tracking-wider uppercase text-slate-900">
                    <span>description</span>
                  </p>
                  <p className="text-xl font-medium tracking-wide text-primary">
                    <span>{nft.description}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
interface NFTProps {
  price: string;
  tokenId: string;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
  contentHash: string;
}
export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getItems();
  const paths = items.map((token) => ({
    params: { id: token.contentHash },
  }));
  return {
    paths, // array of paths
    fallback: true, // this is fallback. Meaning that we want to implement this functionality for if we run a build and we still want users to be able to create an NFT
  };
};
const getItems = async (): Promise<NFTProps[]> => {
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

      const metaUrl = `${ipfsUrl}${tokenURI}`;
      const response = await fetch(metaUrl);
      const meta = await response.json();

      const price = formatEther(i.price);
      let image = (meta.image = `${ipfsUrl}${meta.image}`);
      let item = {
        price,
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
        contentHash: tokenURI,
      };
      return item;
    })
  );
  return items;
};
// When getStaticProps gets invoked from getStaticPaths it expects an object that looks like the params object {params: {id: 1234 }}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;
  const items = await getItems();
  const item = items.filter((item) => item.contentHash === id);
  return {
    props: {
      nft: item[0],
    },
  };
};
export default NFT;
