import Link from "next/link";

const ContestsPage: React.FC = () => {
  return (
    <div className="w-full max-h-screen">
      <div className="flex justify-start">
        <Link
          href="/contests/create-contest"
          className="px-4 py-1 text-white rounded-full bg-primary hover:bg-hoverPrimary"
        >
          Create Contest
        </Link>
      </div>
      <div className="pt-5">
        <div className="text-3xl ">No Contests yet.</div>
      </div>
    </div>
  );
};
export default ContestsPage;
