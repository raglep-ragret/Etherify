import hre from "hardhat";
import {
  EtherifyPlaylist,
  EtherifyPlaylist__factory,
} from "../typechain-types";

const mock = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const etherifyContractFactory = (await hre.ethers.getContractFactory(
    "EtherifyPlaylist"
  )) as EtherifyPlaylist__factory;
  const etherifyContract = await etherifyContractFactory.deploy();
  await etherifyContract.deployed();

  console.log("");
  console.log("Contract deployed to:", etherifyContract.address);
  console.log("Contract deployed by:", owner.address);
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

  const playlist = await etherifyContract.getPlaylist();
  console.log(playlist);

  const tracksByRandom = await etherifyContract.getTracksByAddress(
    randomPerson.address
  );
  console.log(tracksByRandom);

  const trackId = tracksByRandom[0].id;

  console.log(
    "Likes for track %d: %d",
    trackId,
    await etherifyContract.getLikes(trackId)
  );

  await etherifyContract.likeTrack(trackId);

  console.log(
    "Likes for track %d: %d",
    trackId,
    await etherifyContract.getLikes(trackId)
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
