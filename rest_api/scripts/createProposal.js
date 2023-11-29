require('dotenv').config();
const { Command } = require('commander');
const { Contract, JsonRpcProvider } = require('ethers');
const { ethers } = require('hardhat');
const program = new Command();
const DAO_ABI = require('../artifacts/contracts/DAO.sol/DAO.json').abi;
let proposalTitle;
let proposalDescription;
let proposalMinimuMVotes;
let proposalDeadLine;


program
  .name('createProposal')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('createProposal')
  .description('Create a proposal')
  .argument('<title>', 'proposal title')
  .argument('<description>', 'proposal description')
  .argument('<minimumVotes>', 'proposal minimumVotes')
  .argument('<deadline>', 'proposal deadline')
  .action((title, description, minimumVotes, deadline) => {
    proposalTitle = title;
    proposalDescription = description;
    proposalMinimuMVotes = minimumVotes;
    proposalDeadLine = deadline;
  });

program.parse();


async function createProposal() {
    try {
        const provider = new JsonRpcProvider(process.env.API_URL)
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
      
        const DAOContract = new Contract(process.env.CONTRACT_ADDRESS, DAO_ABI, signer)
      
        const proposalsCalldatas = ["0x0123456789abcdef"];

        const proposalTargets = [process.env.TOKEN_ADDRESS];
        const proposalValues = [0];

        const proposalTx = await DAOContract.propose(
            proposalTargets,
            proposalValues,
            proposalsCalldatas,
            proposalTitle,
            proposalDescription,
            proposalMinimuMVotes,
            proposalDeadLine
        )

        console.log("Creating proposal....")

    
        await proposalTx.wait();

        console.log("Proposal Created With Success")

    } catch (error) {
        console.error(error.message);
    }
}

createProposal();
