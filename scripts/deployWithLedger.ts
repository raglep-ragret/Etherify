import hre from "hardhat";
import { EtherifyPlaylist__factory } from "../typechain-types";
import { LedgerSigner } from "@ethersproject/hardware-wallets";
import ethProvider from "eth-provider";

const deployWithLedger = async () => {
  const frame = ethProvider("frame");

  const alchemy = new hre.ethers.providers.AlchemyProvider(
    "rinkeby",
    "6hhJsRNFRNurb2ENCc7qEB5-0xdrBog_"
  );

  const etherifyContractFactory = (await hre.ethers.getContractFactory(
    "EtherifyPlaylist"
  )) as EtherifyPlaylist__factory;

  const ledger = await new LedgerSigner(alchemy, "hid", "m/44'/60'/1'/0/0");

  const ledgerEnabledEtherifyContractFactory =
    await etherifyContractFactory.connect(ledger);

  const trx = await ledgerEnabledEtherifyContractFactory.getDeployTransaction();

  const gasPrice = await alchemy.getGasPrice();
  console.log("Gas price: ", gasPrice);

  const gasLimit = await alchemy.estimateGas(trx);
  console.log("Gas price: ", gasPrice);

  // const sent = await ledger.sendTransaction(trx);

  trx.from = (await frame.request({ method: "eth_requestAccounts" }))[0];

  trx.chainId = await frame.request({ method: "eth_chainId" });
  console.log(trx.chainId);

  const result = await frame.request({
    method: "eth_sendTransaction",
    params: [trx],
  });
  console.log("Frame result: ", result);

  /*
  const gasEstimate = await alchemy.estimateGas(
    await etherifyContractFactory.getDeployTransaction()
  );
  console.log("Estimated gas fee: ", gasEstimate);

  console.log("Now deploying...");
  const etherifyContract = await ledgerEnabledEtherifyContractFactory.deploy({
    chainId: 4,
    gasLimit: gasEstimate,
    gasPrice: gasPrice,
  });
  console.log(etherifyContract.address);

  console.log("Waiting for deployed receipt");
  const receipt = await etherifyContract.deployed();

  console.log("");
  console.log("Etherify deployed to:", receipt.address);
  console.log("Full receipt: ", receipt);
  console.log("");
  */
};

const runDeployWithLedger = async () => {
  try {
    await deployWithLedger();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runDeployWithLedger();
