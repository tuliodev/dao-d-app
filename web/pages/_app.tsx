import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";

import "@/styles/globals.css";
import { ProposalContextProvider } from "@/context/Proposal";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProposalContextProvider>
      <main className={`h-screen ${roboto.className} `}>
        <Component {...pageProps} />
      </main>
    </ProposalContextProvider>
  );
}
