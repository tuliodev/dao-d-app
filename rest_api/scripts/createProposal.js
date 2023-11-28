const { Command } = require('commander');
const { Contract } = require('ethers');
const DAO_ABI = require('./helpers/constants').DAO_ABI;
const { ethers } = require('hardhat');
const program = new Command();
require('dotenv').config();

let proposalDescription;
let proposalDeadline;

program
  .name('createProposal')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('createProposal')
  .description('Create a proposal')
  .argument('<description>', 'proposal description')
  .argument('<proposalTime>', 'proposal deadline')
  .action((description, proposalTime) => {
    proposalDescription = description;
    proposalDeadline = proposalTime
  });

program.parse();


async function createProposal() {
    try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL)
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    
        const DAOContract = new Contract(process.env.CONTRACT_ADDRESS, DAO_ABI, signer)

        const proposalsCalldatas = ["0x0123456789abcdef"];

        const proposalTargets = [process.env.TOKEN_ADDRESS];
        const proposalValues = [0];
 
        const proposalTx = await DAOContract.propose(
            proposalTargets,
            proposalValues,
            proposalsCalldatas,
            proposalDescription
        )


        await proposalTx.wait();

        console.log("Proposal Created With Success")

    } catch (error) {
        console.error(error.message);
    }
}

createProposal();
