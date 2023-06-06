import { useState } from "react";
import { testNFTs } from "../../../utility/data/testData";
import Head from "next/head";
import Image from "next/image";
import TraitBox from "../../../components/Traits/TraitBox";

interface NFTProps {
  id: string;
}
const SingleNFT: React.FC<NFTProps> = ({ id }: { id: string }) => {
  const nft = testNFTs.filter((item) => item.id === Number(id));
  const NFT = nft[0];
  console.log(NFT);

  //if (!nft) return <p>Something went wrong. No NFT has been found.</p>;

  return (
    <div className="flex flex-col w-full align-center max-w-screen">
      {NFT && (
        <div>
          <Head>
            <title>{NFT.name}</title>
          </Head>
          <div className="w-full max-w-full">
            <div className="flex flex-row gap-2">
              <div className="relative mt-5 mb-5 mr-5 overflow-hidden max-w-1/2 w-max">
                <Image
                  src={NFT.image}
                  className="border-2 border-solid rounded-lg border-primary"
                  width={512}
                  height={512}
                  alt="NFT Image"
                ></Image>
              </div>
              <div className="flex flex-col w-1/2 mt-5 mb-5 mr-5 overflow-hidden max-w-1/2">
                <div className="flex flex-row justify-between">
                  <div className="text-3xl font-semibold text-slate-800">
                    {NFT.name}
                  </div>
                  <div className="flex place-content-end">
                    <button className="px-4 py-1 text-white rounded-full bg-primary hover:bg-slate-900">
                      Buy
                    </button>
                  </div>
                </div>
                <div className="flex flex-row">
                  <p className="text-slate-900">
                    <span>Owned by </span>
                  </p>
                </div>
                <div className="flex flex-row mb-4">
                  <p className="text-slate-900">
                    <span>{NFT.description}</span>
                  </p>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-3">
                  <TraitBox traitName="UNKNOWN" image=""></TraitBox>
                  <TraitBox traitName="UNKNOWN" image=""></TraitBox>
                  <TraitBox traitName="UNKNOWN" image=""></TraitBox>
                </div>
                <div className="w-full mt-3">
                  <p className="text-xs tracking-wider uppercase text-slate-900">
                    <span>price</span>
                  </p>
                  <p className="text-xl font-medium tracking-wide uppercase text-primary">
                    <span>{NFT.price} MATIC</span>
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
export default SingleNFT;
