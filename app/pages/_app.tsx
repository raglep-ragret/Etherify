import { Provider } from "react-redux";
import { store } from "../redux/store";
import "tailwindcss/tailwind.css";
import { AppProps } from "next/dist/shared/lib/router/router";
import { ThemeProvider } from "next-themes";
import React from "react";
import NavBar from "../components/NavBar";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Provider store={store}>
        <div className="bg-white dark:bg-gray-900 flex flex-col items-center justify-center min-h-screen">
          <NavBar />
          <Component {...pageProps} />
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
