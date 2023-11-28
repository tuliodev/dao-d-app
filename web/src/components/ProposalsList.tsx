/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";

import Proposal from "./Proposal";

import { ProposalContext } from "@/context/Proposal";

interface ProposalsListPropos {
  web3ModalRef: any;
}

export default function ProposalsList({ web3ModalRef }: ProposalsListPropos) {
  const { proposals } = useContext(ProposalContext);

  return (
    <div className="flex flex-col justify-start w-full mb-8">
      Proposals:
      {proposals.length ? (
        <div className="flex flex-col gap-4 mt-2 w-40v sm:w-80v">
          {proposals.map((v, i) => {
            return (
              <Proposal
                title={v.title}
                description={v.description}
                proposalId={v.proposalId}
                web3ModalRef={web3ModalRef}
                key={v.proposalId}
              />
            );
          })}
        </div>
      ) : (
        <div>
          <h1>No proposals created yet</h1>
        </div>
      )}
    </div>
  );
}
