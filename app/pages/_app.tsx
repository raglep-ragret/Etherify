import { Provider } from "react-redux";
import { store } from "../redux/store";
import "tailwindcss/tailwind.css";
import { AppProps } from "next/dist/shared/lib/router/router";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
