import Head from "next/head";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

import abi from "../../artifacts/contracts/EtherifyPlaylist.sol/EtherifyPlaylist.json";
import AddTrackCard from "../components/AddTrackCard";
import Button from "../components/Button";
import { EtherifyPlaylist } from "../../typechain-types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { authorize, selectAuthorizedWallet } from "../redux/slices/authSlice";

declare global {
  interface Window {
    ethereum: any;
  }
}

type TPlaylist = {
  address: string;
  id: number;
  spotifyLink: string;
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(() => false);

  const contractAddress = "0x2B3b804a9E27C1BA130bDcDc4974B90840a5b8d4";
  const contractABI = abi.abi;

  const dispatch = useAppDispatch();
  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);

  const [isPendingTrx, setIsPendingTrx] = useState(false);
  const [playlist, setPlaylist] = useState<TPlaylist[]>([]);

  const getPlaylist = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        ) as EtherifyPlaylist;

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const playlistRaw = await wavePortalContract.getPlaylist();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let playlistCleaned: TPlaylist[] = [];
        playlistRaw.forEach((track) => {
          playlistCleaned.push({
            address: track.addr,
            id: track.id.toNumber(),
            spotifyLink: track.spotifyLink,
          });
        });

        console.log("Playlist:", playlistCleaned);

        /*
         * Store our data in React State
         */
        setPlaylist(playlistCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("Ethereum object loaded: ", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Has authorized account: ", account);
        dispatch(authorize(account));

        await getPlaylist();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected to wallet: ", accounts[0]);
      dispatch(authorize(accounts[0]));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const addTrack = async (spotifyLink: string) => {
    try {
      if (!spotifyLink || spotifyLink.length === 0) {
        console.log("Invalid Spotify link!");
      } else {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          /*
           * You're using contractABI here
           */
          const wavePortalContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          let count = await wavePortalContract.getTotalTracks();
          console.log("Retrieved total track count: ", count.toNumber());

          /*
           * Execute the actual wave from your smart contract
           */
          const waveTxn = await wavePortalContract.addTrack(
            "https://open.spotify.com/track/4CfkxZ4w0qCNuSA0hMJPeH?si=75cb60393f9a4dfc"
          );
          console.log("Now mining...", waveTxn.hash);
          setIsPendingTrx(true);

          await waveTxn.wait();
          console.log("Mined!", waveTxn.hash);

          count = await wavePortalContract.getTotalTracks();
          console.log("Retrieved total track count: ", count.toNumber());
          setIsPendingTrx(false);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            <Button text="Connect Wallet" onClick={connectWallet} />
          )}

          <AddTrackCard isPendingTrx={isPendingTrx} onSubmit={addTrack} />

          {playlist && (
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
