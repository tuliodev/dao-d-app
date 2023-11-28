import { cacheExchange, Client, fetchExchange } from "urql";

const urqlClient = new Client({
  url: "https://api.studio.thegraph.com/query/59553/dao/0.0.3",
  exchanges: [cacheExchange, fetchExchange],
});

export const getFirst3Proposals = async () => {
  const initProposals = `query ($first: Int!) {
    proposals(first: $first, orderBy: startBlock, orderDirection: desc) {
      id
      proposalId
      proposer
      targetContracts
      calldatas
      description
      endBlock
      startBlock
      targetsLength
      values
    }
  }`;
  const response = await urqlClient.query(initProposals, { first: 3 });
  return response.data.proposals;
};
