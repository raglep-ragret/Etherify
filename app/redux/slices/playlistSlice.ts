import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { EtherifyPlaylist } from "../../../typechain-types";
import { TTrack } from "../../types";
import { maybeGetSpotifyUri } from "../../utils/spotify";
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
  async (_, { dispatch, getState }) => {
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
        timestamp: track.timestamp.toNumber(),
      });
    });

    console.log("Playlist:", playlistCleaned);

    return playlistCleaned;
  }
);

export const getAllLikes = createAsyncThunk(
  "playlist/getAllLikes",
  async (_, { getState }) => {
    const state = getState() as RootState;

    const etherifyContract = maybeGetEthereumContract(state);

    const playlist = state.playlist.playlist;
    console.log("PLAYLIST", playlist);

    if (!playlist) {
      throwError("Can't get likes before we get the playlist!");
    }

    const playlistLikes = playlist!.map((track) =>
      etherifyContract.getLikesForTrack(track.id)
    );
    console.log(playlistLikes);

    const likesForTracks = await Promise.all(playlistLikes);
    const likes: { [id: number]: number } = {};
    likesForTracks.forEach((bigNum, index) => {
      likes[index] = bigNum.toNumber();
    });

    console.log("All likes recieved:", likes);

    return likes;
  }
);

export const getMyLikes = createAsyncThunk(
  "playlist/getMyLikes",
  async (_, { getState }) => {
    const state = getState() as RootState;

    const etherifyContract = maybeGetEthereumContract(state);

    const playlist = state.playlist.playlist;

    if (!playlist) {
      throwError("Can't get likes before we get the playlist!");
    }

    const playlistLikes = playlist!.map((track) =>
      etherifyContract.doILikeTrack(track.id)
    );

    const likesForTracks = await Promise.all(playlistLikes);
    const likes = likesForTracks.reduce((acc, doILike, index) => {
      return { ...acc, [index]: doILike };
    }, {} as { [id: number]: boolean });

    console.log("My likes recieved:", likes);

    return likes;
  }
);

export const getLikesForTrack = createAsyncThunk(
  "playlist/getLikesForTrack",
  async (trackId: number, { getState }) => {
    const etherifyContract = maybeGetEthereumContract(getState() as RootState);

    const count = await etherifyContract.getLikesForTrack(trackId);
    console.log("Total like count for %d: %d", trackId, count.toNumber());

    return count.toNumber();
  }
);

export const addTrack = createAsyncThunk(
  "playlist/addTrack",
  async (spotifyLink: string, { dispatch, getState }) => {
    const spotifyUri = maybeGetSpotifyUri(spotifyLink);

    if (!spotifyUri) {
      throwError("Invalid spotify URI!");
    } else {
      const etherifyContract = maybeGetEthereumContract(
        getState() as RootState
      );

      const initCount = await etherifyContract.getTotalTracks();
      console.log("Total track count before adding: %d", initCount.toNumber());

      const trackAddTxn = await etherifyContract.addTrack(spotifyUri);

      console.log("Now adding track...", trackAddTxn.hash);
      await trackAddTxn.wait();
      console.log("Track added!", trackAddTxn.hash);

      const finalCount = await etherifyContract.getTotalTracks();
      console.log("Total track count after adding: %d", finalCount.toNumber());

      dispatch(getPlaylist()); // Update the playlist to include the new track.
    }
  }
);

export const likeTrack = createAsyncThunk(
  "playlist/likeTrack",
  async (trackId: number, { dispatch, getState }) => {
    const etherifyContract = maybeGetEthereumContract(getState() as RootState);

    const likeTrackTxn = await etherifyContract.likeTrack(trackId);

    console.log("Liking track %d...", trackId, likeTrackTxn.timestamp);
    await likeTrackTxn.wait();
    console.log("Liked track %d!", trackId, likeTrackTxn.timestamp);

    dispatch(getLikesForTrack(trackId));
  }
);

export const unlikeTrack = createAsyncThunk(
  "playlist/unlikeTrack",
  async (trackId: number, { dispatch, getState }) => {
    const etherifyContract = maybeGetEthereumContract(getState() as RootState);

    const likeTrackTxn = await etherifyContract.unlikeTrack(trackId);

    console.log("Unliking track %d...", trackId, likeTrackTxn.timestamp);
    await likeTrackTxn.wait();
    console.log("Unliked track %d!", trackId, likeTrackTxn.timestamp);

    dispatch(getLikesForTrack(trackId));
  }
);

// declaring the types for our state
export type PlaylistState = {
  areLikesLoaded: boolean;
  isAddingTrack: boolean;
  isLoadingLikes: boolean;
  isLoadingMyLikes: boolean;
  isLoadingPlaylist: boolean;
  isPlaylistLoaded: boolean;
  likes: { [id: number]: number };
  myLikes: { [id: number]: boolean };
  playlist: TTrack[] | undefined;
  trackInProcessOfLikeUnlike: { [id: number]: boolean };
};

const initialState: PlaylistState = {
  areLikesLoaded: false,
  isAddingTrack: false,
  isLoadingLikes: false,
  isLoadingMyLikes: false,
  isLoadingPlaylist: false,
  isPlaylistLoaded: false,
  likes: {},
  myLikes: {},
  playlist: [],
  trackInProcessOfLikeUnlike: {},
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
      .addCase(getAllLikes.pending, (state, _action) => {
        state.isLoadingLikes = true;
      })
      .addCase(getAllLikes.rejected, (state, _action) => {
        state.isLoadingLikes = false;
        state.likes = {};
      })
      .addCase(getAllLikes.fulfilled, (state, action) => {
        state.isLoadingLikes = false;
        state.areLikesLoaded = true;
        state.likes = action.payload;
      })
      .addCase(getLikesForTrack.fulfilled, (state, action) => {
        state.likes[action.meta.arg] = action.payload;
      })
      .addCase(getMyLikes.pending, (state, _action) => {
        state.isLoadingMyLikes = true;
      })
      .addCase(getMyLikes.rejected, (state, _action) => {
        state.isLoadingMyLikes = false;
        state.myLikes = {};
      })
      .addCase(getMyLikes.fulfilled, (state, action) => {
        state.isLoadingMyLikes = false;
        state.myLikes = action.payload;
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
        state.isPlaylistLoaded = true;
        state.playlist = action.payload;
      })
      .addCase(likeTrack.pending, (state, _action) => {
        state.trackInProcessOfLikeUnlike[_action.meta.arg] = true;
      })
      .addCase(likeTrack.rejected, (state, _action) => {
        state.trackInProcessOfLikeUnlike[_action.meta.arg] = false;
      })
      .addCase(likeTrack.fulfilled, (state, _action) => {
        state.trackInProcessOfLikeUnlike[_action.meta.arg] = false;
        state.myLikes[_action.meta.arg] = true;
      })
      .addCase(unlikeTrack.pending, (state, _action) => {
        state.trackInProcessOfLikeUnlike[_action.meta.arg] = true;
      })
      .addCase(unlikeTrack.rejected, (state, _action) => {
        state.trackInProcessOfLikeUnlike[_action.meta.arg] = false;
      })
      .addCase(unlikeTrack.fulfilled, (state, _action) => {
        state.trackInProcessOfLikeUnlike[_action.meta.arg] = false;
        state.myLikes[_action.meta.arg] = false;
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

// Returns the number of likes for a track. Defaults to 0.
export const selectLikesForTrack = (trackId: number) => (state: RootState) =>
  state.playlist.likes[trackId] || 0;

// Returns whether the user likes a track. Defaults to false.
export const selectDoILikeTrack = (trackId: number) => (state: RootState) =>
  state.playlist.myLikes[trackId] || false;

// Returns whether a track is in the process of a like or unlike. Defaults to false.
export const selectIsTrackInProcessOfLikeUnlike =
  (trackId: number) => (state: RootState) =>
    state.playlist.trackInProcessOfLikeUnlike[trackId] || false;

// Return the playlist.
export const selectPlaylist = (state: RootState) => state.playlist.playlist;

// Reducer
export const playlistReducer = playlistSlice.reducer;
