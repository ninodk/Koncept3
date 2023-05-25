import { useRouter } from "next/router";

const NFT: React.FC = () => {
  const router = useRouter();
  console.log(router.query);

  return <div>{`Detail page of NFT #${router.query.id}`}</div>;
};
export default NFT;
