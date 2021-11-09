import { MusicNoteIcon } from "@heroicons/react/solid";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import AddTrackCard from "../components/AddTrackCard";
import NavBar from "../components/NavBar";
import Playlist from "../components/Playlist";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
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
    <div className="bg-white dark:bg-gray-900 flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Etherify</title>
        <meta
          name="description"
          content="A distributed Spotify playlist on the Ethereum blockchain."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className="text-black dark:text-gray-50 flex flex-col items-center justify-center w-full flex-1 lg:px-20 px-8 text-center mt-6">
        <h1 className="text-6xl font-medium">
          Welcome to{" "}
          <span className="text-green-400 font-extrabold">etherify</span>!
        </h1>

        <p className="mt-3 text-2xl">
          Etherify is a decentralized Spotify playlist on the Ethereum
          blockchain.
        </p>

        {maybeAuthorizedWallet && (
          <>
            <AddTrackCard /> <Playlist />
          </>
        )}

        {!maybeAuthorizedWallet && (
          <div className="relative block max-w-2xl w-full border-2 border-gray-500 border-dashed rounded-lg p-12 text-center hover:border-gray-400 mt-24">
            <MusicNoteIcon className="mx-auto h-12 w-12" />
            <span className="mt-2 block text-sm font-medium">
              Connect a wallet via the Rinkeby testnet to view the playlist and
              add tracks!
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
