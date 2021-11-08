import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  getAllLikes,
  getMyLikes,
  getPlaylist,
  selectPlaylist,
} from "../redux/slices/playlistSlice";
import PlaylistTrack from "./PlaylistTrack";

const Playlist = () => {
  const dispatch = useAppDispatch();

  const playlist = useAppSelector(selectPlaylist);

  const loadPlaylist = () => dispatch(getPlaylist());
  const loadLikes = () => dispatch(getAllLikes());
  const loadMyLikes = () => dispatch(getMyLikes());

  useEffect(() => {
    loadPlaylist();
  }, []);

  useEffect(() => {
    if (playlist) {
      loadLikes();
      loadMyLikes();
    }
  }, [playlist]);

  return (
    <>
      <h2 className="mt-6 mb-4 text-2xl font-bold">Playlist</h2>

      {playlist && playlist.length > 0 && (
        <ol>
          {playlist.map((track) => (
            <PlaylistTrack key={track.id} track={track} />
          ))}
        </ol>
      )}
    </>
  );
};

export default Playlist;
