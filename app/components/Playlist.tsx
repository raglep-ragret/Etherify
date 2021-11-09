import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  getAllLikes,
  getMyLikes,
  getPlaylist,
  selectPlaylist,
} from "../redux/slices/playlistSlice";
import { selectAuthorizedWallet } from "../redux/slices/web3Slice";
import { truncateEthereumAddress } from "../utils/ethereum";
import EmptyState from "./EmptyState";
import PlaylistTrack from "./PlaylistTrack";

const Playlist = ({ filterAddress }: { filterAddress?: string }) => {
  const dispatch = useAppDispatch();

  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);
  const rawPlaylist = useAppSelector(selectPlaylist);
  const playlistToDisplay = filterAddress
    ? rawPlaylist?.filter((track) => track.address === filterAddress)
    : rawPlaylist;

  const areYouFilteredAddress =
    filterAddress?.toLowerCase() === maybeAuthorizedWallet?.toLowerCase();

  const loadPlaylist = () => dispatch(getPlaylist());
  const loadLikes = () => dispatch(getAllLikes());
  const loadMyLikes = () => dispatch(getMyLikes());

  useEffect(() => {
    if (maybeAuthorizedWallet) {
      loadPlaylist();
    }
  }, [maybeAuthorizedWallet]);

  useEffect(() => {
    if (maybeAuthorizedWallet && playlistToDisplay) {
      loadLikes();
      loadMyLikes();
    }
  }, [maybeAuthorizedWallet, playlistToDisplay]);

  return (
    <>
      {filterAddress && playlistToDisplay && playlistToDisplay.length === 0 && (
        <EmptyState
          message={
            areYouFilteredAddress
              ? "You haven't submitted any tracks yet!"
              : `Address ${truncateEthereumAddress(
                  filterAddress
                )} hasn't submitted any tracks yet!`
          }
        />
      )}

      {playlistToDisplay && playlistToDisplay.length === 0 && (
        <EmptyState
          message="The playlist is empty! Why not submit a track to start the party?"
          truncateTopMargin
        />
      )}

      {playlistToDisplay && playlistToDisplay.length > 0 && (
        <>
          {!filterAddress && (
            <h2 className="mb-4 text-2xl font-bold">Playlist</h2>
          )}

          <ol>
            {playlistToDisplay
              .slice()
              .reverse()
              .map((track) => (
                <PlaylistTrack key={track.id} track={track} />
              ))}
          </ol>
        </>
      )}
    </>
  );
};

export default Playlist;
