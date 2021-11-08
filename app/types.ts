declare global {
  interface Window {
    ethereum: any;
  }
}

export type TTrack = {
  address: string;
  id: number;
  spotifyLink: string;
  timestamp: number;
};
