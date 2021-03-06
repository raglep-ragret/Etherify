import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addTrack, selectIsAddingTrack } from "../redux/slices/playlistSlice";
import Button from "./Button";

const AddTrackCard = () => {
  const [track, setTrack] = useState("");

  const dispatch = useAppDispatch();

  const isAddingTrack = useAppSelector(selectIsAddingTrack);

  const addSpotifyTrack = () => dispatch(addTrack(track));

  return (
    <div className="bg-white dark:bg-black shadow-lg sm:rounded-lg text-left mt-8 mb-6">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-gray-50">
          💽 Add a track!
        </h3>

        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>Submit a Spotify link here to add it to the Etherify playlist.</p>
        </div>

        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full md:max-w-md sm:max-w-xs">
            <label className="sr-only" htmlFor="email">
              Spotify Link
            </label>
            <input
              className="lg:w-96 sm:w-72 w-full shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-900 block sm:text-sm border-gray-300 rounded-md"
              id="email"
              name="email"
              onChange={(event) => setTrack(event.target.value)}
              placeholder="https://open.spotify.com/track/4CfkxZ4w0qCNuSA0hMJPeH?si=75cb60393f9a4dfc"
              type="email"
              value={track}
            />
          </div>
          <Button
            loading={isAddingTrack}
            text="Add Track"
            onClick={addSpotifyTrack}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTrackCard;
