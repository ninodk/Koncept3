import { useRouter } from "next/router";
import { testContests, testNFTs } from "../../../utility/data/testData";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

interface ContestProps {
  id: string;
}
const SingleContest: React.FC<ContestProps> = ({ id }: { id: string }) => {
  const contests = testContests.filter((item) => item.id === Number(id));
  const contest = contests[0];
  const nfts = testNFTs.filter((item) => item.id === 1);
  const dummyNFT = nfts[0];
  return (
    <div className="w-full align-center max-w-screen">
      {contest && (
        <div>
          <Head>
            <title>{contest.title}</title>
          </Head>
          <div className="flex flex-col">
            <div className="w-full max-w-full">
              <div className="flex flex-row gap-2">
                <div className="relative mt-5 mb-5 mr-5 overflow-hidden max-w-1/2 w-max">
                  <Image
                    src={contest.image}
                    className="border-2 border-solid rounded-lg border-primary"
                    width={512}
                    height={512}
                    alt="contest Image"
                  ></Image>
                </div>
                <div className="flex flex-col w-1/2 mt-5 mb-5 mr-5 overflow-hidden max-w-1/2 gap-y-3">
                  <div className="flex flex-row justify-between">
                    <div className="text-3xl font-semibold text-slate-800">
                      {contest.title}
                    </div>
                    <button className="px-4 py-1 text-white rounded-full bg-primary hover:bg-slate-900">
                      Enter
                    </button>
                  </div>
                  <div className="flex flex-row">
                    <p className="text-slate-900">
                      <span>Hosted by </span>
                    </p>
                  </div>

                  <div className="grid grid-flow-col grid-rows-3 gap-x-8 gap-y-4 auto-cols-auto">
                    <div className="col-start-1 row-span-3">
                      <p className="text-xs tracking-wider uppercase text-slate-900">
                        <span>{contest.reward} reward</span>
                      </p>
                      {contest.reward === "NFT" ? (
                        <div className="p-2 mt-2 border-2 rounded-xl h-fit bg-slate-800 border-primary w-fit">
                          <Link href={`/collections/NFT/${dummyNFT.id}`}>
                            <Image
                              src={dummyNFT?.image}
                              width={168}
                              height={168}
                              alt="dummyNFT"
                              className="rounded-lg"
                            ></Image>
                            <p className="pl-1 mt-1 text-white text-md">
                              <span>{dummyNFT.name}</span>
                            </p>
                          </Link>
                        </div>
                      ) : (
                        <p className="mt-2 text-center rounded-lg px-2 py-0.5 font-medium text-sm tracking-wide uppercase bg-purple-600 text-white">
                          <span>50 MATIC</span>
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-row gap-x-8 auto-rows-auto">
                        <div className="flex flex-col">
                          <p className="text-xs tracking-wider uppercase text-slate-900">
                            <span>Start Date</span>
                          </p>
                          <p className="mt-1 text-xl font-medium tracking-wide uppercase text-primary">
                            <span>{contest.startDate}</span>
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xs tracking-wider uppercase text-slate-900">
                            <span>End Date</span>
                          </p>
                          <p className="mt-1 text-xl font-medium tracking-wide uppercase text-primary">
                            <span>{contest.endDate}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-xs tracking-wider uppercase text-slate-900">
                        <span>Description</span>
                      </p>
                      <p className="text-slate-900">
                        <span>{contest.description}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SingleContest;
