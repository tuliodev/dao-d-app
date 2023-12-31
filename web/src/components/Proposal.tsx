import { MouseEvent, useEffect, useState } from "react";

import { Contract, utils } from "ethers";
import { toast } from "react-toastify";

import { DAO_ABI, DAO_CONTRACT_ADDRESS } from "@/helpers/constants";
import { getProviderOrSigner } from "@/helpers/walletProvider";

interface ProposalProps {
  proposalId: string;
  title: string;
  description: string;
  minimumVotes: number;
  web3ModalRef: any;
}

export default function Proposal({
  title,
  description,
  proposalId,
  minimumVotes,
  web3ModalRef,
}: ProposalProps) {
  const [proposalState, setProposalState] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [voting, setVoting] = useState<boolean>(false);
  const [forVotes, setForVotes] = useState<string>("");
  const [againstVotes, setAgainstVotes] = useState<string>("");

  const states = [
    "📪 Archived",
    "🛠️ Active",
    "❌ Rejected",
    "❌ Failed",
    "🚀 Ready For Execution",
    "❌ Not reached votes",
    "🏆 Executed",
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
      toast(`Voted!`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "success",
      });

      getProposalVotes();
    } catch (error: any) {
      toast(`${error?.message}`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "error",
      });
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
              {parseInt(forVotes) + parseInt(againstVotes) < minimumVotes &&
              proposalState != 1
                ? states[5]
                : states[proposalState]}
            </p>
          </div>

          <p className="font-bold text-2xl">{title}</p>
          <p className="text-lg text-slate-500">{description}</p>

          <div className="flex flex-col gap-2">
            <p>
              For: {forVotes} | Against: {againstVotes}
            </p>
            <small>Vote below: </small>
            <small>Minimum votes: {minimumVotes}</small>
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
