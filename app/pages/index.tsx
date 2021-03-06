import Head from "next/head";
import React, { useEffect } from "react";
import AddTrackCard from "../components/AddTrackCard";
import EmptyState from "../components/EmptyState";
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
    <>
      <Head>
        <title>Etherify</title>
        <meta
          name="description"
          content="A distributed Spotify playlist on the Ethereum blockchain."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            <AddTrackCard />
            <Playlist />
          </>
        )}

        {!maybeAuthorizedWallet && (
          <EmptyState
            message="Connect a wallet via the Rinkeby testnet to view the playlist and
          add tracks!"
          />
        )}
      </main>
    </>
  );
}
