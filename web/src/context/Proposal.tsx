import { createContext, ReactNode, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { getFirst5Proposals } from "@/services/api";

interface Proposal {
  proposalId: string;
  title: string;
  description: string;
  startBlock: number;
  minimumVotes: number;
}

interface ContextProps {
  proposals: Proposal[];
  proposalsEnd: boolean;
  lastStartBlock: number;
  walletConnected: boolean;
  getProposals: () => void;
  connectWallet: (connected: boolean) => void;
  isConnected: () => void;
}

interface ProviderProps {
  children: ReactNode;
}

export const ProposalContext = createContext({} as ContextProps);

export function ProposalContextProvider({ children }: ProviderProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsEnd, setProposalsEnd] = useState<boolean>(false);
  const [lastStartBlock, setLastStartBlock] = useState<number>(0);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  async function getProposals() {
    try {
      const serializedProposals: Proposal[] = await getFirst5Proposals();

      if (serializedProposals.length === 0) {
        setProposalsEnd(true);
      } else {
        setLastStartBlock(
          serializedProposals[serializedProposals.length - 1].startBlock,
        );
        setProposals(serializedProposals);
      }
    } catch (error) {
      toast(`Error fetching proposal`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "error",
      });
    }
  }

  function connectWallet(connected: boolean) {
    setWalletConnected(connected);
  }

  async function isConnected() {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      toast(`You are connected to: ${accounts[0]}`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "success",
      });
      setWalletConnected(true);
    } else {
      toast(`Metamask is not connected`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "error",
      });
    }
  }

  useEffect(() => {
    if (walletConnected) {
      getProposals();
    }
  }, [walletConnected]);

  return (
    <ProposalContext.Provider
      value={{
        proposals,
        proposalsEnd,
        lastStartBlock,
        walletConnected,
        getProposals,
        connectWallet,
        isConnected,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
}
