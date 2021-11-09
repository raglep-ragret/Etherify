import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import React from "react";
import SpotifyPlayer from "react-spotify-player";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  likeTrack,
  selectDoILikeTrack,
  selectIsTrackInProcessOfLikeUnlike,
  selectLikesForTrack,
  unlikeTrack,
} from "../redux/slices/playlistSlice";
import { TTrack } from "../types";
import { truncateEthereumAddress } from "../utils/ethereum";
import { maybeGetSpotifyUri } from "../utils/spotify";
import { selectAuthorizedWallet } from "../redux/slices/web3Slice";

const PlaylistTrack = ({ track }: { track: TTrack }) => {
  const dispatch = useAppDispatch();

  const likes = useAppSelector(selectLikesForTrack(track.id));
  const doILikeTrack = useAppSelector(selectDoILikeTrack(track.id));
  const isTrackBeingLikedOrUnliked = useAppSelector(
    selectIsTrackInProcessOfLikeUnlike(track.id)
  );
  const maybeAuthorizedWallet = useAppSelector(selectAuthorizedWallet);

  const likeThisTrack = () => dispatch(likeTrack(track.id));
  const unlikeThisTrack = () => dispatch(unlikeTrack(track.id));

  return (
    /* TODO: Make this responsive */
    <li className="flex flex-row justify-between items-center gap-6 mb-3">
      <Link href={`/${track.address}`}>
        <a className="font-mono hover:text-green-700 dark:hover:text-green-300 w-28">
          {track.address.toLowerCase() === maybeAuthorizedWallet?.toLowerCase()
            ? `${truncateEthereumAddress(track.address)} (You)`
            : truncateEthereumAddress(track.address)}
        </a>
      </Link>

      <SpotifyPlayer
        size={{
          width: 360,
          height: 80,
        }}
        uri={maybeGetSpotifyUri(track.spotifyUri)}
      />

      <span
        className="flex flex-row items-center hover:text-green-700 dark:hover:text-green-300"
        onClick={
          isTrackBeingLikedOrUnliked
            ? undefined
            : doILikeTrack
            ? unlikeThisTrack
            : likeThisTrack
        }
        role="button"
      >
        {isTrackBeingLikedOrUnliked &&
          (doILikeTrack ? (
            <HeartIconSolid
              aria-hidden={true}
              className="h-4 w-4 -ml-0.5 mr-2 animate-ping"
            />
          ) : (
            <HeartIconOutline
              aria-hidden={true}
              className="h-4 w-4 -ml-0.5 mr-2 animate-ping"
            />
          ))}

        {!isTrackBeingLikedOrUnliked &&
          (doILikeTrack ? (
            <HeartIconSolid
              aria-hidden={true}
              className="h-4 w-4 -ml-0.5 mr-2 cursor-pointer"
            />
          ) : (
            <HeartIconOutline
              aria-hidden={true}
              className="h-4 w-4 -ml-0.5 mr-2 cursor-pointer"
            />
          ))}

        {likes}
      </span>
    </li>
  );
};

export default PlaylistTrack;
