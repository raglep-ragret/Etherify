import { Provider } from "react-redux";
import { store } from "../redux/store";
import "tailwindcss/tailwind.css";
import { AppProps } from "next/dist/shared/lib/router/router";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
