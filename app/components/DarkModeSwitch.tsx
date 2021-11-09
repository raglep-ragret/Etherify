import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useTheme } from "next-themes";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import AddTrackCard from "../components/AddTrackCard";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import Playlist from "../components/Playlist";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  connectWallet,
  isWalletConnected,
  selectAuthorizedWallet,
} from "../redux/slices/web3Slice";

export default function DarkModeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleDarkMode = () =>
    setTheme(theme === "dark" || resolvedTheme === "dark" ? "light" : "dark");

  const dispatch = useAppDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-8 h-8 p-1 ml-1 mr-1 sm:ml-4 rounded-full bg-gray-800"
      onClick={toggleDarkMode}
    >
      <span className="sr-only">Toggle dark mode</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="text-gray-300"
      >
        {theme === "dark" || resolvedTheme === "dark" ? (
          <SunIcon />
        ) : (
          <MoonIcon />
        )}
      </svg>
    </button>
  ) : (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-8 h-8 p-1 ml-1 mr-1 rounded sm:ml-4"
    >
      <span className="sr-only">Toggle dark mode</span>
      <MoonIcon />
    </button>
  );
}
