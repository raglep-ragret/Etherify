import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import {
  LockClosedIcon,
  LockOpenIcon,
  PlayIcon,
  RefreshIcon,
} from "@heroicons/react/solid";
import DarkModeSwitch from "./DarkModeSwitch";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  connectWallet,
  selectAuthorizedWallet,
  selectIsCurrentlyConnectingToEthereum,
} from "../redux/slices/web3Slice";
import { truncateEthereumAddress } from "../utils/ethereum";
import React from "react";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/", current: true, local: true },
  {
    name: "GitHub",
    href: "https://github.com/raglep-ragret/Etherify",
    current: false,
    local: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = () => {
  const dispatch = useAppDispatch();

  const isAuthorizing = useAppSelector(selectIsCurrentlyConnectingToEthereum);
  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);

  const doConnectWallet = () => dispatch(connectWallet());

  return (
    <Disclosure as="nav" className="bg-black w-full">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <Link href="/">
                  <a className="flex-shrink-0 flex items-center">
                    <PlayIcon className="block h-8 w-auto text-green-400 align-middle mr-1" />
                    <span className="hidden text-white lg:block w-auto font-extrabold text-2xl align-middle leading-none pb-1">
                      etherify
                    </span>
                  </a>
                </Link>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) =>
                    item.local ? (
                      <Link href={item.href} key={item.name}>
                        <a
                          aria-current={item.current ? "page" : undefined}
                          className={classNames(
                            item.current
                              ? "border-green-500 text-gray-100"
                              : "border-transparent text-gray-700 hover:border-gray-600 hover:text-gray-500",
                            "px-3 py-2 text-sm font-medium border-b-2 h-full flex flex-row items-center"
                          )}
                        >
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    ) : (
                      <a
                        aria-current={item.current ? "page" : undefined}
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "border-green-500 text-gray-100"
                            : "border-transparent text-gray-700 hover:border-gray-600 hover:text-gray-500",
                          "px-3 py-2 text-sm font-medium border-b-2 h-full flex flex-row items-center"
                        )}
                        target={"_blank"}
                      >
                        <span>{item.name}</span>
                      </a>
                    )
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    className={classNames(
                      isAuthorizing || maybeAuthorizedWallet
                        ? "cursor-default"
                        : "",
                      "relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
                    )}
                    disabled={isAuthorizing || !!maybeAuthorizedWallet}
                    onClick={
                      isAuthorizing || !maybeAuthorizedWallet
                        ? doConnectWallet
                        : undefined
                    }
                    type="button"
                  >
                    {isAuthorizing && (
                      <>
                        <RefreshIcon
                          className="-ml-1 mr-2 h-5 w-5 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Connecting...</span>
                      </>
                    )}

                    {!maybeAuthorizedWallet && !isAuthorizing && (
                      <>
                        <LockOpenIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        <span>Connect Wallet</span>
                      </>
                    )}

                    {maybeAuthorizedWallet && (
                      <>
                        <LockClosedIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        <span>
                          {truncateEthereumAddress(maybeAuthorizedWallet)}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="hidden md:ml-4 md:-mr-2 md:flex-shrink-0 md:flex md:items-center">
                  <DarkModeSwitch />
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  aria-current={item.current ? "page" : undefined}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  target={!item.local ? "_blank" : undefined}
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

export default NavBar;
