import { HeartIcon } from "@heroicons/react/outline";
import { RefreshIcon } from "@heroicons/react/solid";
import React, { useEffect } from "react";
import SpotifyPlayer from "react-spotify-player";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { TTrack } from "../types";
import { truncateEthereumAddress } from "../utils/ethereum";
import { maybeGetSpotifyUri } from "../utils/spotify";

const PlaylistTrack = ({ track }: { track: TTrack }) => {
  return (
    /* TODO: Make this responsive */
    <li
      className="flex flex-row justify-between items-center gap-6 mb-3"
      key={track.id}
    >
      <a href="#">{truncateEthereumAddress(track.address)}</a>
      <SpotifyPlayer
        size={{
          width: 360,
          height: 80,
        }}
        uri={maybeGetSpotifyUri(track.spotifyLink)}
      />
      <span className="flex flex-row items-center">
        <HeartIcon aria-hidden={true} className="h-4 w-4 -ml-0.5 mr-2" />0
      </span>
    </li>
  );
};

export default PlaylistTrack;
