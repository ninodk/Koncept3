import Link from "next/link";

const CollectionsPage: React.FC = () => {
  return (
    <div className="w-full max-h-screen">
      <div className="flex justify-start">
        <Link
          href="/collections/create-nft"
          className="px-4 py-1 text-white rounded-full bg-primary hover:bg-hoverPrimary"
        >
          Create NFT
        </Link>
      </div>
      <div className="pt-5">
        <div className="text-3xl ">No NFTs yet.</div>
      </div>
    </div>
  );
};
export default CollectionsPage;
