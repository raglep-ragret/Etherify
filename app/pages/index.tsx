import Head from "next/head";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import DarkModeToggle from "react-dark-mode-toggle";
import AddTrackCard from "../components/AddTrackCard";
import Button from "../components/Button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  connectWallet,
  selectAuthorizedWallet,
  selectContractAbi,
  selectContractAddress,
} from "../redux/slices/web3Slice";
import { TTrack } from "../types";
import {
  getPlaylist,
  selectIsLoadingPlaylist,
  selectPlaylist,
} from "../redux/slices/playlistSlice";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(() => false);

  const dispatch = useAppDispatch();
  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);
  const playlist = useAppSelector(selectPlaylist);

  const authorize = () => dispatch(connectWallet());
  const loadPlaylist = () => dispatch(getPlaylist());

  useEffect(() => {
    authorize();
    loadPlaylist();
  }, []);

  return (
    <div className={`${isDarkMode && "dark"}`}>
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
          <DarkModeToggle
            onChange={setIsDarkMode}
            checked={isDarkMode}
            size={80}
          />
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
            <Button text="Connect Wallet" onClick={authorize} />
          )}

          <AddTrackCard />

          {playlist && playlist.length > 0 && (
            <ol>
              {playlist.map((track) => (
                <li key={track.id}>{track.spotifyLink}</li>
              ))}
            </ol>
          )}
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
    </div>
  );
}
