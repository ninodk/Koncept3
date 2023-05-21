import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Home from "../../pages";
import NFTsPage from "../../pages/NFTs";
import Link from "next/link";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "Collections", href: "#", current: false },
  { name: "Events", href: "#", current: false },
  { name: "Contests", href: "#", current: false },
  { name: "Creator Space", href: "#", current: false },
];

const Navigation: React.FC = () => {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="relative">
            <div className="fixed top-0 left-0 right-0 max-w-full bg-white sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
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
                <div className="flex items-center justify-center flex-1 sm:items-center sm:justify-start">
                  <div className="flex items-center flex-shrink-0">
                    <Image
                      src="/polygon.png"
                      className="h-8 mr-3"
                      alt="Koncept3 Logo"
                      width={30}
                      height={30}
                    />
                    <span className="block w-auto h-8 text-2xl antialiased font-semibold text-primary lg:hidden">
                      Koncept3
                    </span>
                    <span className="hidden w-auto h-8 text-2xl antialiased font-semibold text-primary lg:block">
                      Koncept3
                    </span>
                  </div>
                  <div className="relative hidden overflow-auto sm:ml-6 sm:block">
                    <div className="min-w-0 mx-auto max-w-fit sm:max-w-full sm:min-w-full">
                      <div className="flex space-x-4 overflow-x-auto justify-self-center">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-primary text-white"
                                : "text-primary hover:bg-primary hover:text-white",
                              "rounded-full px-4 py-1.5 text-md font-medium whitespace-nowrap flex-none"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="px-4 py-1.5 bg-white rounded-full text-primary hover:text-white hover:bg-primary focus:outline-none focus:ring-0 focus:text-white focus:ring-primary focus:bg-primary active:bg-white active:text-primary"
                  >
                    <span className="">Connect</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-primary hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
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
