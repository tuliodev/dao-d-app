import { createContext, ReactNode, useState } from "react";

import { getFirst3Proposals } from "@/services/api";

interface Proposal {
  proposalId: string;
  description: string;
  startBlock: number;
}

interface ContextProps {
  proposals: Proposal[];
  proposalsEnd: boolean;
  lastStartBlock: number;
  getProposals: () => void;
}

interface ProviderProps {
  children: ReactNode;
}

export const ProposalContext = createContext({} as ContextProps);

export function ProposalContextProvider({ children }: ProviderProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsEnd, setProposalsEnd] = useState<boolean>(false);
  const [lastStartBlock, setLastStartBlock] = useState<number>(0);

  async function getProposals() {
    try {
      const serializedProposals: Proposal[] = await getFirst3Proposals();

      if (serializedProposals.length === 0) {
        setProposalsEnd(true);
      } else {
        setLastStartBlock(
          serializedProposals[serializedProposals.length - 1].startBlock,
        );
        setProposals(serializedProposals);
      }
    } catch (error) {
      alert("Error fetching proposal");
    }
  }

  return (
    <ProposalContext.Provider
      value={{ proposals, proposalsEnd, lastStartBlock, getProposals }}
    >
      {children}
    </ProposalContext.Provider>
  );
}
