import hre from "hardhat";
import { EtherifyPlaylist__factory } from "../typechain-types";

const deployWithHardhatAccount = async () => {
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

const runDeployWithHardhatAccount = async () => {
  try {
    await deployWithHardhatAccount();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runDeployWithHardhatAccount();
