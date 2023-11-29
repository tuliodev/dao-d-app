import { cacheExchange, Client, fetchExchange } from "urql";

const urqlClient = new Client({
  url: "https://api.studio.thegraph.com/query/59553/dao/1.0.4",
  exchanges: [cacheExchange, fetchExchange],
});

export const getFirst5Proposals = async () => {
  const initProposals = `query ($first: Int!) {
    proposals(first: $first, orderBy: startBlock, orderDirection: desc) {
      id
      proposalId
      proposer
      targetContracts
      calldatas
      title
      description
      endBlock
      startBlock
      targetsLength
      values,
      minimumVotes
    }
  }`;
  const response = await urqlClient.query(initProposals, { first: 5 });
  return response.data.proposals;
};
