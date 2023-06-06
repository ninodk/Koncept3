import { useRouter } from "next/router";
import SingleNFT from "./SingleNFT";

const NFT: React.FC = () => {
  const router = useRouter();
  return <SingleNFT id={router.query.id} />;
};
export default NFT;
