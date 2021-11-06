import hre from "hardhat";
import { EtherifyPlaylist__factory } from "../typechain-types";

const deploy = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const etherifyContractFactory = (await hre.ethers.getContractFactory(
    "EtherifyPlaylist"
  )) as EtherifyPlaylist__factory;
  const etherifyContract = await etherifyContractFactory.deploy();
  await etherifyContract.deployed();

  console.log("");
  console.log("Etherify deployed to:", etherifyContract.address);
  console.log("");
};

const runDeploy = async () => {
  try {
    await deploy();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runDeploy();
