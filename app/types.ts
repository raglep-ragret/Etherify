declare global {
  interface Window {
    ethereum: any;
  }
}

export type TTrack = {
  address: string;
  id: number;
  spotifyUri: string;
  timestamp: number;
};
