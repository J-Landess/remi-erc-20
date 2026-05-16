require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Remi with:", deployer.address);

  const Remi = await hre.ethers.getContractFactory("Remi");
  const remi = await Remi.deploy(deployer.address);
  await remi.waitForDeployment();

  const address = await remi.getAddress();
  console.log("Remi deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
