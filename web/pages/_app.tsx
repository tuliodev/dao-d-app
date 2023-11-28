import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";

import { ToastContainer } from "react-toastify";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ProposalContextProvider } from "@/context/Proposal";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProposalContextProvider>
      <main className={`h-screen ${roboto.className} `}>
        <ToastContainer />
        <Component {...pageProps} />
      </main>
    </ProposalContextProvider>
  );
}
