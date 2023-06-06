import { useRouter } from "next/router";
import SingleContest from "./SingleContest";

const Contest: React.FC = () => {
  const router = useRouter();
  return <SingleContest id={router.query.id} />;
};
export default Contest;
