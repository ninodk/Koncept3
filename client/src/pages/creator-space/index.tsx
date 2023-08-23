import Link from "next/link";
import Created from "./created";
import { useAccount } from "wagmi";
import { ownerAddress } from "../../../../server/src/configurations/config";
import Collected from "./collected";
import { useState } from "react";
import classNames from "classnames";

const CreatorSpacePage: React.FC = () => {
  const [collectedPanel, setCollectedPanel] = useState(true);
  const [createdPanel, setCreatedPanel] = useState(false);
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });
  const showCollectionPanel = () => {
    setCollectedPanel(true);
    setCreatedPanel(false);
  };
  const showCreatedPanel = () => {
    setCollectedPanel(false);
    setCreatedPanel(true);
  };
  return (
    <>
      {account.isConnected ? (
        <div className="w-screen h-full">
          <div className="flex flex-col mx-12 mt-16 space-y-6">
            <div className="rounded-md w-60 h-60 bg-primary"></div>
            <div className="flex w-full h-12 bg-white">
              <span className="mt-2 text-3xl font-bold text-slate-700">
                {account.address}
              </span>
            </div>
            <div className="h-1/2">
              <div className="text-sm font-medium text-left border-b text-slate-700 border-slate-500 ">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <Link
                      href={`creator-space`}
                      onClick={() => showCollectionPanel()}
                      className={classNames(
                        "block pt-4 pb-4 pr-4 rounded-t-lg active:border-b-2 ",
                        collectedPanel &&
                          "border-primary border-b-2 text-primary"
                      )}
                    >
                      Collected
                    </Link>
                  </li>
                  <li className="mr-2">
                    <Link
                      onClick={() => showCreatedPanel()}
                      href={`creator-space`}
                      className={classNames(
                        "block pt-4 pb-4 pr-4 rounded-t-lg active:border-b-2 ",
                        createdPanel && "border-primary border-b-2 text-primary"
                      )}
                    >
                      Created
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {collectedPanel ? <Collected></Collected> : <Created></Created>}
          </div>
        </div>
      ) : (
        <div>Sorry, only accessible by contract owner. </div>
      )}
    </>
  );
};
export default CreatorSpacePage;
