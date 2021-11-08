const spotifyUriTemplate = (spotifyId: string) => `spotify:track:${spotifyId}`;

const spotifyUrlOrUriRegex =
  /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(?:album|track)(?::|\/)((?:[0-9a-zA-Z]){22})/;

export const maybeGetSpotifyUri = (maybeSpotifyUrlOrUri: string) => {
  const match = maybeSpotifyUrlOrUri.match(spotifyUrlOrUriRegex);

  if (match) {
    const spotifyId = match[1];
    return spotifyUriTemplate(spotifyId);
  } else {
    return undefined;
  }
};
