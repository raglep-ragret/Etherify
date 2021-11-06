import Head from "next/head";
import React, { useState } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

const TrackInput = () => {
  return (
    <div className="bg-white dark:bg-black shadow-lg sm:rounded-lg text-left mt-8">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-gray-50">
          💽 Add a track!
        </h3>

        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>Submit a Spotify link here to add it to the Etherify playlist.</p>
        </div>

        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full md:max-w-md sm:max-w-xs">
            <label className="sr-only" htmlFor="email">
              Spotify Link
            </label>
            <input
              className="lg:w-96 sm:w-72 w-full shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-900 block sm:text-sm border-gray-300 rounded-md"
              id="email"
              name="email"
              placeholder="https://open.spotify.com/track/4CfkxZ4w0qCNuSA0hMJPeH?si=75cb60393f9a4dfc"
              type="email"
            />
          </div>
          <button
            className="mt-3 w-full whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            type="submit"
          >
            Add Track
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(() => false);

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

          <TrackInput />
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
