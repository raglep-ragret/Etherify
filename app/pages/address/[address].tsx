import { ethers } from "ethers";
import Head from "next/head";
import { useRouter } from "next/router";
import DefaultErrorPage from "next/error";
import React, { useEffect } from "react";
import EmptyState from "../../components/EmptyState";
import Playlist from "../../components/Playlist";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  isWalletConnected,
  selectAuthorizedWallet,
} from "../../redux/slices/web3Slice";
import { truncateEthereumAddress } from "../../utils/ethereum";

export default function Address() {
  const router = useRouter();
  const { address } = router.query;

  const isAddressValid = address && ethers.utils.isAddress(address as string);

  const truncatedAddress = isAddressValid
    ? truncateEthereumAddress(address as string)
    : undefined;

  const dispatch = useAppDispatch();

  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);

  const checkIfConnected = () => dispatch(isWalletConnected());

  const areYouThisAddress =
    address &&
    (address as string).toLowerCase() === maybeAuthorizedWallet?.toLowerCase();

  useEffect(() => {
    checkIfConnected();
  }, []);

  return isAddressValid ? (
    <>
      <Head>
        <title>
          {areYouThisAddress
            ? "Your tracks"
            : `Tracks from address ${truncatedAddress}`}
        </title>
        <meta
          name="description"
          content="A distributed Spotify playlist on the Ethereum blockchain."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-black dark:text-gray-50 flex flex-col items-center justify-center w-full flex-1 lg:px-20 px-8 text-center mt-6">
        {areYouThisAddress ? (
          <h1 className="text-6xl font-medium mb-6">Your tracks</h1>
        ) : (
          <h1 className="text-6xl font-medium mb-6">
            Tracks from address{" "}
            <span className="font-mono text-green-900 dark:text-green-100">
              {truncatedAddress}
            </span>
          </h1>
        )}

        {maybeAuthorizedWallet && truncatedAddress && (
          <Playlist filterAddress={address as string} />
        )}

        {!maybeAuthorizedWallet && (
          <EmptyState
            message="Connect a wallet via the Rinkeby testnet to view the playlist and
          add tracks!"
          />
        )}
      </main>
    </>
  ) : (
    <DefaultErrorPage statusCode={404} />
  );
}
