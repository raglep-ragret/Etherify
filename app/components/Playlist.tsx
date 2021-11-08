import { HeartIcon } from "@heroicons/react/outline";
import { RefreshIcon } from "@heroicons/react/solid";
import React, { useEffect } from "react";
import SpotifyPlayer from "react-spotify-player";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getPlaylist, selectPlaylist } from "../redux/slices/playlistSlice";
import { truncateEthereumAddress } from "../utils/ethereum";
import { maybeGetSpotifyUri } from "../utils/spotify";
import PlaylistTrack from "./PlaylistTrack";

const Playlist = () => {
  const dispatch = useAppDispatch();

  const playlist = useAppSelector(selectPlaylist);

  const loadPlaylist = () => dispatch(getPlaylist());

  useEffect(() => {
    loadPlaylist();
  }, []);

  return (
    <>
      <h2 className="mt-6 mb-4 text-2xl font-bold">Playlist</h2>

      {playlist && playlist.length > 0 && (
        <ol>
          {playlist.map((track) => (
            <PlaylistTrack track={track} />
          ))}
        </ol>
      )}
    </>
  );
};

export default Playlist;
