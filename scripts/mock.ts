import hre from "hardhat";
import { EtherifyPlaylist__factory } from "../typechain-types";

const mock = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const etherifyContractFactory = (await hre.ethers.getContractFactory(
    "EtherifyPlaylist"
  )) as EtherifyPlaylist__factory;
  const etherifyContract = await etherifyContractFactory.deploy({
    // TS types wrong here- overriding
    // @ts-ignore
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await etherifyContract.deployed();

  const initialContractBalance = await hre.ethers.provider.getBalance(
    etherifyContract.address
  );

  console.log("");
  console.log("Contract deployed to:", etherifyContract.address);
  console.log("Contract deployed by:", owner.address);
  console.log(
    "Initial balance:",
    hre.ethers.utils.formatEther(initialContractBalance)
  );
  console.log("");

  let etherifyCount;
  etherifyCount = await etherifyContract.getTotalTracks();

  const etherifyTxn = await etherifyContract.addTrack(
    "https://open.spotify.com/track/4CfkxZ4w0qCNuSA0hMJPeH?si=75cb60393f9a4dfc"
  );
  await etherifyTxn.wait();

  etherifyCount = await etherifyContract.getTotalTracks();

  const etherifyTxn2 = await etherifyContract
    .connect(randomPerson)
    .addTrack(
      "https://open.spotify.com/track/6GRos6Klc30XItsQtGUcak?si=09f4a6f4be0e4655"
    );
  await etherifyTxn2.wait();

  etherifyCount = await etherifyContract.getTotalTracks();

  const tracksByRandom = await etherifyContract.getTracksByAddress(
    randomPerson.address
  );

  const finalContractBalance = await hre.ethers.provider.getBalance(
    etherifyContract.address
  );

  console.log("");
  console.log(
    "Final contract balance:",
    hre.ethers.utils.formatEther(finalContractBalance)
  );
  console.log("");

  const trackId = tracksByRandom[0].id;

  console.log(
    "Likes for track %d: %d",
    trackId,
    await etherifyContract.getLikesForTrack(trackId)
  );

  await etherifyContract.likeTrack(trackId);
  console.log(
    "Likes for track %d: %d",
    trackId,
    await etherifyContract.getLikesForTrack(trackId)
  );
  console.log(
    "Do I like track?:",
    await etherifyContract.doILikeTrack(trackId)
  );

  await etherifyContract.unlikeTrack(trackId);
  console.log(
    "Likes for track %d: %d",
    trackId,
    await etherifyContract.getLikesForTrack(trackId)
  );
  console.log(
    "Do I like track?:",
    await etherifyContract.doILikeTrack(trackId)
  );
};

const runMock = async () => {
  try {
    await mock();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMock();
