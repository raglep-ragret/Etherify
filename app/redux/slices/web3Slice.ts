import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import abi from "../../../artifacts/contracts/EtherifyPlaylist.sol/EtherifyPlaylist.json";
import { throwError } from "../../utils/utils";

const CONTRACT_ADDRESS = "0x8371904a663174322cF68789dd9e15F2081074Bc";
const CONTRACT_ABI = abi.abi;

export const connectWallet = createAsyncThunk(
  "web3/connectWallet",
  async () => {
    const { ethereum } = window;

    if (!ethereum) {
      return throwError("Make sure you have Metamask!");
    } else {
      console.log("Ethereum object loaded: ", ethereum);
    }

    const accounts = (await ethereum.request({
      method: "eth_accounts",
    })) as string[];

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Has authorized account: ", account);

      return account;
    } else {
      return throwError("No authorized account found");
    }
  }
);

// declaring the types for our state
export type Web3State = {
  isCurrentlyConnectingToEthereum: boolean;
  etherifyContractAbi: typeof CONTRACT_ABI;
  etherifyContractAddress: string;
  maybeAuthorizedWallet: string | undefined;
};

const initialState: Web3State = {
  isCurrentlyConnectingToEthereum: false,
  etherifyContractAbi: CONTRACT_ABI,
  etherifyContractAddress: CONTRACT_ADDRESS,
  maybeAuthorizedWallet: undefined,
};

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    // Deauthorize a wallet
    deauthorizeWallet: (state) => {
      state.maybeAuthorizedWallet = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state, _action) => {
        state.isCurrentlyConnectingToEthereum = true;
      })
      .addCase(connectWallet.rejected, (state, _action) => {
        state.isCurrentlyConnectingToEthereum = false;
        state.maybeAuthorizedWallet = undefined;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isCurrentlyConnectingToEthereum = false;
        state.maybeAuthorizedWallet = action.payload;
      });
  },
});

// Actions
export const { deauthorizeWallet } = web3Slice.actions;

// Return `true` if there's a connected wallet.
export const selectIsAuthorized = (state: RootState) =>
  !!state.web3.maybeAuthorizedWallet;

// Get the authorized wallet address, if it exists. Else, `undefined`.
export const selectAuthorizedWallet = (state: RootState) =>
  state.web3.maybeAuthorizedWallet;

// Get the Etherify contract address.
export const selectContractAddress = (state: RootState) =>
  state.web3.etherifyContractAddress;

// Get the Etherify contract ABI.
export const selectContractAbi = (state: RootState) =>
  state.web3.etherifyContractAbi;

// Reducer
export const web3Reducer = web3Slice.reducer;
