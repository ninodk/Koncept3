import Link from "next/link";
import Created from "./created";
import { useAccount } from "wagmi";
import { ownerAddress } from "../../../../server/src/configurations/config";

const CreatorSpacePage: React.FC = () => {
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  return (
    <>
      {isConnected && address === ownerAddress ? (
        <div className="w-screen h-full">
          <div className="flex flex-col mx-12 mt-16 space-y-6">
            <div className="rounded-md w-60 h-60 bg-primary"></div>
            <div className="flex w-full h-12 bg-white">
              <span className="mt-2 text-3xl font-bold text-slate-700">
                Koncept3
              </span>
            </div>
            <div className="h-1/2">
              <div className="text-sm font-medium text-left border-b text-slate-700 border-slate-500 ">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <Link
                      href="/creator-space/"
                      className="block pt-4 pb-4 pr-4 rounded-t-lg active:border-b-2 active:border-primary hover:border-b-2 hover:border-primary hover:text-primary active:text-primary"
                    >
                      Collected
                    </Link>
                  </li>
                  <li className="mr-2">
                    <Link
                      href={"/creator-space/"}
                      className="block pt-4 pb-4 pr-4 rounded-t-lg active:border-b-2 active:border-primary hover:border-b-2 hover:border-primary hover:text-primary active:text-primary"
                      aria-current="page"
                    >
                      Created
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <span className="mt-16 text-slate-700">No Items yet.</span>
          </div>
        </div>
      ) : (
        <div>Sorry, only accessible by contract owner. </div>
      )}
    </>
  );
};
export default CreatorSpacePage;
