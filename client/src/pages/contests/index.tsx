import Link from "next/link";
import { useState } from "react";
import { testContests } from "../../utility/data/testData";

const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState(testContests);
  return (
    <div className="w-full max-h-screen">
      <div className="flex justify-start">
        <Link
          href="/contests/create-contest"
          className="px-4 py-1 text-white rounded-full bg-primary hover:bg-slate-800"
        >
          Create Contest
        </Link>
      </div>
      <span className="relative block mt-4 text-2xl text-slate-800">
        Now Listed
      </span>
      <div className="flex flex-row pt-5 space-x-4">
        {contests && contests.length ? (
          contests.map((contest) => (
            <div
              key={contest.id}
              className="flex flex-col border-2 shadow w-80 rounded-2xl border-primary bg-slate-800"
            >
              <Link href={`/contests/contest/${contest.id}`} className="">
                {contest.image && (
                  <img
                    className="p-3 rounded-3xl"
                    src={contest.image}
                    alt={contest.title}
                  />
                )}
              </Link>
              <div className="pt-2 pb-4 pl-4 pr-4">
                <Link href={`/contests/contest/${contest.id}`}>
                  <span className="flex mb-2 text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {contest.title}
                  </span>
                </Link>
                <span className="flex mb-3 font-normal text-slate-400">
                  {contest.description}
                </span>
                <div className="flex flex-row items-center space-x-2 text-xs">
                  <span className="w-1/3 px-2 py-3 font-semibold text-center bg-purple-600 rounded-full text-slate-100">
                    HOLDERS
                  </span>
                  <span className="w-1/3 px-2 py-3 font-semibold text-center rounded-full bg-slate-600 text-slate-100">
                    {contest.startDate}
                  </span>

                  <button className="w-1/3 px-2 py-3 font-semibold rounded-full bg-primary text-slate-50 hover:bg-slate-600">
                    Enter
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-3xl ">No contests yet.</div>
        )}
      </div>
    </div>
  );
};
export default ContestsPage;
