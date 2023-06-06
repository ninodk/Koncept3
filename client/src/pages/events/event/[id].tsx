import { useRouter } from "next/router";
import SingleEvent from "./SingleEvent";

const Event: React.FC = () => {
  const router = useRouter();
  return <SingleEvent id={router.query.id} />;
};
export default Event;
