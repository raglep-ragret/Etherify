import { Provider } from "react-redux";
import { store } from "../redux/store";
import "tailwindcss/tailwind.css";
import { AppProps } from "next/dist/shared/lib/router/router";
import { ThemeProvider } from "next-themes";
import React, { Children } from "react";
import NavBar from "../components/NavBar";
import { useAppSelector } from "../redux/hooks";
import {
  selectAuthorizedWallet,
  selectIsOnRinkeby,
} from "../redux/slices/web3Slice";
import EmptyState from "../components/EmptyState";
import NotificationCenter from "../components/NotificationCenter";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Provider store={store}>
        <div className="bg-white dark:bg-gray-900 flex flex-col items-center justify-center min-h-screen">
          <NavBar />
          <ChainIdChecker>
            <Component {...pageProps} />
          </ChainIdChecker>
          <NotificationCenter />
        </div>
      </Provider>
    </ThemeProvider>
  );
}

const ChainIdChecker: React.FunctionComponent = (props) => {
  const isOnRinkeby = useAppSelector(selectIsOnRinkeby);
  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);

  const authorizedToWrongChain = maybeAuthorizedWallet && !isOnRinkeby;

  return authorizedToWrongChain ? (
    <main className="text-black dark:text-gray-50 flex flex-col items-center justify-center w-full flex-1 lg:px-20 px-8 text-center mt-6">
      <EmptyState message="You're authorized to the wrong network! Please switch your network to the Rinkeby testnet." />
    </main>
  ) : (
    <>{props.children}</>
  );
};

export default MyApp;
