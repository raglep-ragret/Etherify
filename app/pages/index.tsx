import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useTheme } from "next-themes";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import AddTrackCard from "../components/AddTrackCard";
import Button from "../components/Button";
import DarkModeSwitch from "../components/DarkModeSwitch";
import NavBar from "../components/NavBar";
import Playlist from "../components/Playlist";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  connectWallet,
  isWalletConnected,
  selectAuthorizedWallet,
} from "../redux/slices/web3Slice";

export default function Home() {
  const dispatch = useAppDispatch();

  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);

  const checkIfConnected = () => dispatch(isWalletConnected());

  useEffect(() => {
    checkIfConnected();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-col items-center min-h-screen">
      <Head>
        <title>Etherify</title>
        <meta
          name="description"
          content="A distributed Spotify playlist on the Ethereum blockchain."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className="text-black dark:text-gray-50 flex flex-col items-center w-full flex-1 lg:px-20 px-8 text-center mt-16">
        <h1 className="text-6xl font-medium">
          Welcome to{" "}
          <span className="text-green-400 font-extrabold">etherify</span>!
        </h1>

        <p className="mt-3 text-2xl">
          Etherify is a decentralized Spotify playlist on the Ethereum
          blockchain.
        </p>

        <AddTrackCard />

        <Playlist />
      </main>
    </div>
  );
}
