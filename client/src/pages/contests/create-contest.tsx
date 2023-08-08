import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Image from "next/image";
import { Fragment, MouseEventHandler, useState } from "react";
import { useAccount } from "wagmi";
import { ownerAddress } from "../../../../server/src/configurations/config";

const demoNFTs = [
  {
    id: 1,
    name: "Koncept Kitten #1",
    description: "Its a kitten koncept yo",
    price: "12 MATIC",
    supply: 1,
  },
  {
    id: 2,
    name: "Koncept Kitten #3",
    description: "Its a kitten koncept yo",
    price: "12 MATIC",
    supply: 1,
  },
];
const CreateContest: React.FC = () => {
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const [selected, setSelected] = useState(demoNFTs[0]);
  const [reward, setReward] = useState("");
  const toggleReward: MouseEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLElement;
    const value: string = target?.textContent;

    if (value) setReward(value);
  };
  return (
    <>
      {isConnected && address === ownerAddress ? (
        <div className="w-10/12 h-full">
          <div className="grid grid-flow-row grid-cols-2 mt-5 auto-rows-max gap-x-4 gap-y-8">
            <div className="text-4xl font-semibold leading-7 text-slate-800">
              Create a Contest
            </div>
            <div className="col-start-1">
              <label
                htmlFor="image"
                className="block pb-4 text-xl font-medium leading-6 text-slate-700"
              >
                Upload an Image, Video, Audio or 3D model
              </label>
              <div className="flex justify-center px-6 py-10 mt-2 border-2 border-dotted border-slate-700 rounded-xl">
                <div className="text-center">
                  <div className="flex justify-center mt-4 text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative font-semibold bg-white rounded-md cursor-pointer text-primary focus-within:outline-none focus-within:ring-0 focus-within:ring-slate-700 focus-within:ring-offset-2 hover:text-slate-700"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="col-start-1 row-start-3">
              <label
                htmlFor="name"
                className="block pb-4 text-xl font-medium leading-6 text-slate-700"
              >
                Name
              </label>
              <div className="flex rounded-md shadow-sm ring-2 ring-inset ring-slate-500 focus-within:ring-2 focus-visible:outline-none focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Design Our New Logo"
                />
              </div>
            </div>
            <div className="col-start-1 row-start-4">
              <label
                htmlFor="description"
                className="block w-full pb-4 text-xl font-medium leading-6 text-slate-700"
              >
                Description
              </label>
              <div>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  autoComplete="description"
                  className="block w-full rounded-md border-0 py-1.5 px-3 focus-visible:outline-none text-slate-700 shadow-sm ring-2 ring-inset ring-slate-500 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="We need a new logo, design it, get rewarded!"
                />
              </div>
            </div>
            <div className="flex flex-row row-start-5 space-x-4">
              <div className="w-1/2 col-start-1">
                <label
                  htmlFor="startdate"
                  className="block pb-4 text-xl font-medium leading-6 text-slate-700"
                >
                  Start Date
                </label>
                <div className="flex rounded-md shadow-sm ring-2 ring-inset ring-slate-600 focus-visible:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
                  <input
                    type="datetime-local"
                    name="startdate"
                    id="startdate"
                    autoComplete="startdate"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 px-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="w-1/2 col-start-1 row-start-5">
                <label
                  htmlFor="supply"
                  className="block pb-4 text-xl font-medium leading-6 text-slate-700"
                >
                  End Date
                </label>
                <div className="flex rounded-md shadow-sm ring-2 ring-inset focus-visible:outline-none ring-slate-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
                  <input
                    type="datetime-local"
                    name="enddate"
                    id="enddate"
                    autoComplete="enddate"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full col-start-2 row-span-4">
              <span className="block pb-4 text-xl font-medium leading-6 text-slate-700">
                Preview
              </span>
              <div className="flex items-center justify-center h-full px-6 py-20 mt-2 border-2 border-dotted border-slate-700 rounded-xl">
                <div className="relative block">
                  <span className="text-xl font-normal leading-6 text-slate-700">
                    Upload files to see a preview
                  </span>
                </div>
              </div>
            </div>
            <div className="h-auto col-start-1">
              <span className="block pb-4 text-xl font-medium leading-6 text-slate-700">
                Rewards
              </span>
              <div className="flex flex-col h-full">
                <div className="flex flex-row space-x-4">
                  <div
                    onClick={toggleReward}
                    className={classNames(
                      reward === "NFT"
                        ? "border-primary text-primary"
                        : "border-slate-500 text-slate-900",
                      "h-12 flex flex-col items-center justify-center w-1/2 px-6 py-20 mt-2 border-2 border-solid hover:text-primary rounded-xl hover:border-primary"
                    )}
                  >
                    <Image
                      src="/nft-logo.svg"
                      width={64}
                      height={64}
                      alt="nft-svg"
                      className="hover:text-primary"
                    />
                    <span className="mt-2 font-medium">NFT</span>
                  </div>
                  <div
                    onClick={toggleReward}
                    className={classNames(
                      reward === "Token"
                        ? "border-primary text-primary"
                        : "border-slate-500 text-slate-900",
                      "h-12 flex flex-col items-center justify-center w-1/2 px-6 py-20 mt-2 border-2 border-solid hover:text-primary rounded-xl hover:border-primary"
                    )}
                  >
                    <Image
                      src="/ethereum.svg"
                      width={64}
                      height={64}
                      alt="ethereum-svg"
                      className="text-primary"
                    ></Image>
                    <span className="mt-2 font-medium">Token</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-start-1 row-span-2">
              <div
                className={classNames(
                  reward && reward === "NFT" ? "block" : "hidden"
                )}
              >
                <Listbox value={selected} onChange={setSelected}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block pb-4 text-xl font-normal leading-6 text-slate-700">
                        Choose a NFT
                      </Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-slate-900 shadow-sm ring-2 ring-inset ring-slate-500 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
                          <span className="flex items-center">
                            <span className="block ml-3 truncate">
                              {selected.id} - {selected.name}
                            </span>
                          </span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
                            <ChevronUpDownIcon
                              className="w-5 h-5 text-slate-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {demoNFTs.map((nft) => (
                              <Listbox.Option
                                key={nft.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-primary text-white"
                                      : "text-slate-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={nft}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-semibold"
                                            : "font-normal",
                                          "ml-3 block truncate"
                                        )}
                                      >
                                        {nft.name}
                                      </span>
                                    </div>
                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-primary",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <div
                className={classNames(
                  reward && reward === "Token" ? "block" : "hidden"
                )}
              >
                <label
                  htmlFor="amount"
                  className="block pb-4 text-xl font-medium leading-6 text-slate-700"
                >
                  Amount
                </label>
                <div className="flex rounded-md shadow-sm ring-2 focus-visible:border-primary ring-inset ring-slate-600 focus-visible:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    autoComplete="amount"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="0.01"
                  />
                  <span className="flex items-center pr-3 text-gray-500 select-none sm:text-sm">
                    MATIC
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6 gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 text-sm font-semibold text-white rounded-full shadow-sm bg-primary hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>Sorry, only accessible by contract owner. </div>
      )}
    </>
  );
};
export default CreateContest;
