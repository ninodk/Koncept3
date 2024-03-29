import { Fragment, MouseEventHandler } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import Link from "next/link";
import Image from "next/image";
import Web3ModalButton from "../WalletConnect/Web3ModalButton";
import { useAccount } from "wagmi";
import { ownerAddress } from "../../../../server/src/configurations/config";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Events", href: "/events" },
  { name: "Contests", href: "/contests" },
  { name: "Creator Space", href: "/creator-space" },
];

const Navigation: React.FC = () => {
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });
  return (
    <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <div className="box-border fixed top-0 z-40 block w-full h-16 bg-white">
            <div className="block w-full h-full mx-auto max-w-screen sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-full">
                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 m-2 bg-white rounded-full text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-0">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex items-center justify-center flex-1 place-items-center lg:place-items-start lg:justify-start">
                  <div className="h-full lg:pr-1 lg:justify-items-start ">
                    <Link href="#" className="box-border flex items-center">
                      <div className="box-border relative block h-9 w-9">
                        <div className="box-border absolute inset-0 block overflow-hidden">
                          <Image
                            src="/polygon.png"
                            className="box-content inset-0 block max-w-full max-h-full min-w-full min-h-full overflow-clip"
                            alt="Koncept3 Logo"
                            width={32}
                            height={32}
                          />
                        </div>
                      </div>
                      <div className="flex ml-2.5 mt-0.5 relative box-border">
                        <span className="w-full text-2xl antialiased font-semibold border-box text-primary ">
                          Koncept3
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="relative hidden overflow-auto lg:ml-6 lg:block">
                    <div className="min-w-0 mx-auto max-w-fit lg:max-w-full lg:min-w-full">
                      <div className="flex space-x-4 overflow-x-auto justify-self-center">
                        {/* {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={
                              "text-primary hover:bg-primary hover:text-white rounded-full px-4 py-0.5 text-md font-medium whitespace-nowrap flex-none"
                            }
                          >
                            {item.name}
                          </Link>
                        ))} */}
                        <Link
                          href="/"
                          className={
                            "text-primary hover:bg-primary hover:text-white rounded-full px-4 py-0.5 text-md font-medium whitespace-nowrap flex-none"
                          }
                        >
                          Home
                        </Link>
                        <Link
                          href="/collections"
                          className={
                            "text-primary hover:bg-primary hover:text-white rounded-full px-4 py-0.5 text-md font-medium whitespace-nowrap flex-none"
                          }
                        >
                          Collections
                        </Link>
                        <Link
                          href="/events"
                          className={
                            "text-primary hover:bg-primary hover:text-white rounded-full px-4 py-0.5 text-md font-medium whitespace-nowrap flex-none"
                          }
                        >
                          Events
                        </Link>
                        <Link
                          href="/contests"
                          className={
                            "text-primary hover:bg-primary hover:text-white rounded-full px-4 py-0.5 text-md font-medium whitespace-nowrap flex-none"
                          }
                        >
                          Contests
                        </Link>
                        {account.isConnected && (
                          <Link
                            href="/creator-space"
                            className={
                              "text-primary hover:bg-primary hover:text-white rounded-full px-4 py-0.5 text-md font-medium whitespace-nowrap flex-none"
                            }
                          >
                            Creator Space
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* <button
                    type="button"
                    className="px-4 py-0.5 bg-white rounded-full text-primary hover:text-white hover:bg-primary focus:outline-none focus:ring-0 focus:text-white focus:ring-primary focus:bg-primary active:bg-white active:text-primary"
                  >
                    <span className="">Connect</span>
                  </button> */}
                  <Web3ModalButton></Web3ModalButton>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="box-border fixed left-0 right-0 block w-full mt-2 bg-white top-1 lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={
                    "text-primary hover:bg-primary hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
export default Navigation;
