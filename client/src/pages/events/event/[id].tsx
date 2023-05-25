import { useRouter } from "next/router";

const Event: React.FC = () => {
  const router = useRouter();
  console.log(router.query);

  return <div>{`Detail page of Event #${router.query.id}`}</div>;
};
export default Event;
