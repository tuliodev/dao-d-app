const hre = require("hardhat");

async function main() {

  const _daoToken = await hre.ethers.deployContract("DAOToken", [2000000]);

  await _daoToken.waitForDeployment();

  console.log(
    `deployed to ${_daoToken.target}`
  );

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
