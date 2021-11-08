import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { EtherifyPlaylist } from "../../../typechain-types";
import { TTrack } from "../../types";
import { throwError } from "../../utils/utils";
import type { RootState } from "../store";

const maybeGetEthereumContract = (state: RootState) => {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const etherifyContract = new ethers.Contract(
      state.web3.etherifyContractAddress,
      state.web3.etherifyContractAbi,
      signer
    ) as EtherifyPlaylist;
    return etherifyContract;
  }

  return throwError("Couldn't load the Etherify contract.");
};

export const getPlaylist = createAsyncThunk(
  "playlist/getPlaylist",
  async (_, { getState }) => {
    const etherifyContract = maybeGetEthereumContract(getState() as RootState);

    // Call the smart contract to retrieve the playlist.
    const playlistRaw = await etherifyContract.getPlaylist();

    // We only need address, id, and spotify link in our UI.
    let playlistCleaned: TTrack[] = [];
    playlistRaw.forEach((track) => {
      playlistCleaned.push({
        address: track.addr,
        id: track.id.toNumber(),
        spotifyLink: track.spotifyLink,
      });
    });

    console.log("Playlist:", playlistCleaned);

    return playlistCleaned;
  }
);

export const addTrack = createAsyncThunk(
  "playlist/addTrack",
  async (spotifyLink: string, { dispatch, getState }) => {
    if (!spotifyLink || spotifyLink.length === 0) {
      throwError("Invalid Spotify link!");
    }

    const etherifyContract = maybeGetEthereumContract(getState() as RootState);

    let count = await etherifyContract.getTotalTracks();
    console.log("Retrieved total track count: ", count.toNumber());

    const waveTxn = await etherifyContract.addTrack(spotifyLink);

    console.log("Now mining...", waveTxn.hash);
    await waveTxn.wait();
    console.log("Mined!", waveTxn.hash);

    count = await etherifyContract.getTotalTracks();
    console.log("Retrieved total track count: ", count.toNumber());

    dispatch(getPlaylist()); // Update the playlist to include the new track.
  }
);

// declaring the types for our state
export type PlaylistState = {
  isAddingTrack: boolean;
  isLoadingLikes: boolean;
  isLoadingPlaylist: boolean;
  playlist: TTrack[];
};

const initialState: PlaylistState = {
  isAddingTrack: false,
  isLoadingLikes: false,
  isLoadingPlaylist: false,
  playlist: [],
};

export const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTrack.pending, (state, _action) => {
        state.isAddingTrack = true;
      })
      .addCase(addTrack.rejected, (state, _action) => {
        state.isAddingTrack = false;
      })
      .addCase(addTrack.fulfilled, (state, _action) => {
        state.isAddingTrack = false;
      })
      .addCase(getPlaylist.pending, (state, _action) => {
        state.isLoadingPlaylist = true;
      })
      .addCase(getPlaylist.rejected, (state, _action) => {
        state.isLoadingPlaylist = false;
        state.playlist = [];
      })
      .addCase(getPlaylist.fulfilled, (state, action) => {
        state.isLoadingPlaylist = false;
        state.playlist = action.payload;
      });
  },
});

// Return `true` if a track is currently being added
export const selectIsAddingTrack = (state: RootState) =>
  state.playlist.isAddingTrack;

// Return `true` if likes are currently loading.
export const selectIsLoadingLikes = (state: RootState) =>
  state.playlist.isLoadingLikes;

// Return `true` if playlist is currently loading.
export const selectIsLoadingPlaylist = (state: RootState) =>
  !!state.playlist.isLoadingPlaylist;

// Return the playlist.
export const selectPlaylist = (state: RootState) => state.playlist.playlist;

// Reducer
export const playlistReducer = playlistSlice.reducer;
