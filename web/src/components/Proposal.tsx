import { MouseEvent, useEffect, useState } from "react";

import { Contract, utils } from "ethers";

import { DAO_ABI, DAO_CONTRACT_ADDRESS } from "@/helpers/constants";
import { getProviderOrSigner } from "@/helpers/walletProvider";

interface ProposalProps {
  proposalId: string;
  description: string;
  web3ModalRef: any;
}

export default function Proposal({
  description,
  proposalId,
  web3ModalRef,
}: ProposalProps) {
  const [proposalState, setProposalState] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [voting, setVoting] = useState<boolean>(false);
  const [forVotes, setForVotes] = useState<string>("");
  const [againstVotes, setAgainstVotes] = useState<string>("");

  const states = [
    "📪 Not found",
    "🛠️ Active",
    "🏆 Success",
    "❌ Failed",
    "🚀 Ready For Execution",
  ];

  useEffect(() => {
    if (proposalId) {
      setLoading(true);
      getProposalState();
      getProposalVotes();
    }
  }, []);

  const getProposalState = async () => {
    try {
      const provider = await getProviderOrSigner(false, web3ModalRef);

      const DAOContract = new Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, provider);

      const result = await DAOContract.state(utils.bigNumberify(proposalId));
      setProposalState(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  async function getProposalVotes() {
    try {
      const provider = await getProviderOrSigner(false, web3ModalRef);

      const DAOContract = new Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, provider);

      const votes = await DAOContract._proposalVotes(
        utils.bigNumberify(proposalId),
      );

      setAgainstVotes(votes[0].toString());
      setForVotes(votes[1].toString());
    } catch (error) {
      console.log(error);
    }
  }

  async function handleVote(e: MouseEvent<HTMLButtonElement>, vote: number) {
    e.preventDefault();
    try {
      const signer = await getProviderOrSigner(true, web3ModalRef);

      const DAOContract = new Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, signer);

      const voteTx = await DAOContract.vote(
        utils.bigNumberify(proposalId),
        vote,
      );

      setVoting(true);

      await voteTx.wait();

      setVoting(false);
      alert("Voted!");
      getProposalVotes();
    } catch (error: any) {
      alert(error?.message);
    }
  }

  return (
    <div className="p-4 bg-green-400 border rounded-xl flex flex-col gap-2 h-1/4">
      {loading ? (
        "Loading Proposal..."
      ) : (
        <>
          <div className="flex flex-wrap justify-between gap-2 sm:gap-0">
            <p title="proposalId" className="text-sm">
              ID: {proposalId.substring(0, 15) + "..."}
            </p>
            <p className="p-4 bg-yellow-200 w-full text-slate-900 border rounded-xl text-center">
              {states[proposalState]}
            </p>
          </div>
          <p className="font-bold text-2xl">{description}</p>

          <div className="flex flex-col gap-2">
            <p>
              For: {forVotes} | Against: {againstVotes}
            </p>
            <small>Vote below: </small>
            <div className="flex flex-wrap gap-5">
              {voting ? (
                "Voting..."
              ) : (
                <>
                  <button
                    className="text-2xl border p-2 border-white rounded-xl hover:opacity-60"
                    onClick={(e) => handleVote(e, 1)}
                  >
                    👍
                  </button>
                  <button
                    className="text-2xl border p-2 border-white rounded-xl hover:opacity-60"
                    onClick={(e) => handleVote(e, 0)}
                  >
                    👎
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
