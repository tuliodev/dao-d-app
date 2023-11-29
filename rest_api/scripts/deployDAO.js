const hre = require("hardhat");

async function main() {

  const dao = await hre.ethers.deployContract("DAO", ["0xABA2C6C466Ee881f69CDbc3bd1d15cd313B66A2e"]);

  await dao.waitForDeployment();

  console.log(`deployed to ${dao.target}`);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
