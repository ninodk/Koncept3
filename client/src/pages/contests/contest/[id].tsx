import { useRouter } from "next/router";

const Contest: React.FC = () => {
  const router = useRouter();
  console.log(router.query);

  return <div>{`Detail page of Contest #${router.query.id}`}</div>;
};
export default Contest;
