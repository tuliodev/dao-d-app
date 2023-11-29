require('dotenv').config();
const { keccak256, toUtf8Bytes, JsonRpcProvider, Contract } = require('ethers');
const { ethers } = require('hardhat');
const cron = require('node-cron');
const DAO_ABI = require('../artifacts/contracts/DAO.sol/DAO.json').abi;

const url = `https://api.studio.thegraph.com/query/59553/dao/1.0.4`;

const query = `
  query {
    proposals(first: 5, orderBy: startBlock, orderDirection: desc) {
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
      minimumVotes,
      votingDuration
    }
  }
`;



console.log('running the cron')

async function executeProposal(proposalId, proposalTargets, proposalValues, proposalCalldatas, proposalTitleHash, proposalDescHash, proposalMinimumVotes, proposalDeadline) {
    
    const provider = new JsonRpcProvider(process.env.API_URL);
    
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    
    const DAOContract = new Contract(process.env.CONTRACT_ADDRESS, DAO_ABI, signer)

    const executeTx = await DAOContract.execute(ethers.toBigInt(ethers.toBigInt(proposalId)), proposalTargets, proposalValues, proposalCalldatas, proposalTitleHash, proposalDescHash, proposalMinimumVotes, proposalDeadline)

    await executeTx.wait();

    console.log(`Proposal ${proposalId} Executed with success`);
}



cron.schedule('* * * * *', () => {
    console.log('running task')
    const proposals = [];
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query }),
    })
    .then(response=>{
        return response.json();
    }).then(proposal => {proposal.data.proposals.map((proposal) => proposals.push(proposal))})
    .catch(error =>{console.log(error)})

    setTimeout(() => {    
        proposals.map(async (proposal) => {
            const proposalId = proposal.proposalId;
            const proposalTargets = proposal.targetContracts;
            const proposalValues = proposal.values;
            const proposalCalldatas = proposal.calldatas;
            const proposalTitleHash = keccak256(toUtf8Bytes(proposal.title))
            const proposalDescHash = keccak256(toUtf8Bytes(proposal.description))
            const proposalMinimumVotes = proposal.minimumVotes
            const proposalDeadline = proposal.votingDuration
            const provider = new JsonRpcProvider(process.env.API_URL);
            const DAOContract = new Contract(process.env.CONTRACT_ADDRESS, DAO_ABI, provider)
            const state = await DAOContract.state(ethers.toBigInt(proposalId));
            const votes = await DAOContract._proposalVotes(
                ethers.toBigInt(proposalId)
            )

            console.log(state);

            if ((votes[0] + votes[1]) >= proposalMinimumVotes) {
                
                if(state == 4) {
                    if(votes[0] < votes[1]) {
                        await executeProposal(proposalId, proposalTargets, proposalValues, proposalCalldatas, proposalTitleHash, proposalDescHash, proposalMinimumVotes, proposalDeadline)
                    }
                }
            }

        })
    }, 10000);
    
})
