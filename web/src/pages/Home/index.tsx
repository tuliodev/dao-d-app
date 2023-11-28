/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";

import Web3Modal from "web3modal";

import GetToken from "@/components/GetToken";
import ProposalsList from "@/components/ProposalsList";
import { ProposalContext } from "@/context/Proposal";
import { getProviderOrSigner } from "@/helpers/walletProvider";

export default function Home() {
  const [walletConnected, setWalletConeccted] = useState<boolean>(false);

  const { getProposals } = useContext(ProposalContext);

  const web3ModalRef = useRef<Web3Modal>();

  const handleConnect = async () => {
    try {
      await getProviderOrSigner(true, web3ModalRef);
      setWalletConeccted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnect = async () => {
    setWalletConeccted(false);
  };

  useEffect(() => {
    if (walletConnected) {
      getProposals();
    }
  }, [walletConnected]);

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected]);

  return (
    <div className="flex items-center justify-center flex-col gap-12 mt-8  ">
      <h1>DAO APP</h1>

      {walletConnected ? (
        <div className="flex items-center justify-center flex-col gap-4">
          <button
            className="p-4 bg-red-400 border rounded-xl text-white cursor-pointer"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>

          <GetToken web3ModalRef={web3ModalRef} />
          <ProposalsList web3ModalRef={web3ModalRef} />
        </div>
      ) : (
        <button
          className="p-4 bg-green-700 border rounded-xl text-white cursor-pointer"
          onClick={handleConnect}
        >
          Connect wallet
        </button>
      )}
    </div>
  );
}
