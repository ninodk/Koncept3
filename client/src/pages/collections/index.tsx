import Link from "next/link";
import { useState } from "react";

/// Testdata
const testNFTs = [
  {
    id: 1,
    name: "Koncept Kick #1",
    image: `/Koncept1.png`,
    description: "Not just a shoe",
    price: 15.8,
    supply: 1,
  },
  {
    id: 2,
    name: "Koncept Kick #2",
    image: `/Koncept2.png`,
    description: "Not just a shoe",
    price: 12.1,
    supply: 1,
  },
  {
    id: 3,
    name: "Koncept Kick #3",
    image: `/Koncept3.png`,
    description: "Not just a shoe",
    price: 8.3,
    supply: 1,
  },
  {
    id: 4,
    name: "Koncept Kick #4",
    image: `/Koncept4.png`,
    description: "Not just a shoe",
    price: 20,
    supply: 1,
  },
  {
    id: 4,
    name: "Koncept Kick #5",
    image: `/Koncept1.png`,
    description: "Not just a shoe",
    price: 19,
    supply: 1,
  },
];
const CollectionsPage: React.FC = () => {
  const [NFTs, setNFTs] = useState(testNFTs);
  return (
    <div className="w-full max-h-screen">
      <div className="flex justify-start">
        <Link
          href="/collections/create-nft"
          className="px-4 py-1 text-white rounded-full bg-primary hover:bg-slate-800"
        >
          Create NFT
        </Link>
      </div>
      <span className="relative block mt-4 text-2xl text-slate-800">
        Now Listed
      </span>
      <div className="flex flex-row pt-5 space-x-4">
        {NFTs && NFTs.length ? (
          NFTs.map((nft) => (
            <div
              key={nft.id}
              className="flex flex-col border-2 shadow w-80 rounded-2xl border-primary bg-slate-800"
            >
              <Link href={`/collections/NFT/${nft.id}}`} className="">
                {nft.image && (
                  <img
                    className="p-3 rounded-3xl"
                    src={nft.image}
                    alt={nft.name}
                  />
                )}
              </Link>
              <div className="pt-2 pb-4 pl-4 pr-4">
                <Link href={`/collections/NFT/${nft.id}}`}>
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
          <div className="text-3xl ">No NFTs yet.</div>
        )}
      </div>
    </div>
  );
};
export default CollectionsPage;
