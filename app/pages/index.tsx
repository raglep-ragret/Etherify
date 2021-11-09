import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useTheme } from "next-themes";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import AddTrackCard from "../components/AddTrackCard";
import Button from "../components/Button";
import Playlist from "../components/Playlist";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  connectWallet,
  isWalletConnected,
  selectAuthorizedWallet,
} from "../redux/slices/web3Slice";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleDarkMode = () =>
    setTheme(theme === "dark" || resolvedTheme === "dark" ? "light" : "dark");

  const dispatch = useAppDispatch();

  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);

  const checkIfConnected = () => dispatch(isWalletConnected());
  const doConnectWallet = () => dispatch(connectWallet());

  useEffect(() => {
    setMounted(true);
    checkIfConnected();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Etherify</title>
        <meta
          name="description"
          content="A distributed Spotify playlist on the Ethereum blockchain."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full flex flex-row justify-end py-2 px-2">
        {mounted ? (
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="w-8 h-8 p-1 ml-1 mr-1 rounded sm:ml-4"
            onClick={toggleDarkMode}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            >
              {theme === "dark" || resolvedTheme === "dark" ? (
                <SunIcon />
              ) : (
                <MoonIcon />
              )}
            </svg>
          </button>
        ) : (
          <MoonIcon />
        )}
      </div>

      <main className="text-black dark:text-gray-50 flex flex-col items-center justify-center w-full flex-1 lg:px-20 px-8 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-green-400">Etherify</span>!
        </h1>

        <p className="mt-3 text-2xl">
          Etherify is a decentralized Spotify playlist on the Ethereun
          blockchain, built by{" "}
          <a
            className="font-mono text-green-400"
            href="https://github.com/raglep-ragret"
            target="_blank"
          >
            ~raglep-ragret
          </a>
          .
        </p>

        {!maybeAuthorizedWallet && (
          <Button text="Connect Wallet" onClick={doConnectWallet} />
        )}

        <AddTrackCard />

        <Playlist />
      </main>

      {/*
      <footer className="text-black dark:text-gray-50 flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
  </footer>
  */}
    </div>
  );
}
