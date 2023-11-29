require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { API_URL, PRIVATE_KEY, ETHERSCAN_KEY} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20", 
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  }, 
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [PRIVATE_KEY]
    }
  },
};
