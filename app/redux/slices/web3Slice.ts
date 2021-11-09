import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import abi from "../../../artifacts/contracts/EtherifyPlaylist.sol/EtherifyPlaylist.json";
import { throwError } from "../../utils/utils";
import { BigNumber } from "@ethersproject/bignumber";

const CONTRACT_ADDRESS = "0x6FCC7B10bbA2c5E5Ace79d0eFc390dD4900D5d4B";
const CONTRACT_ABI = abi.abi;

export const isWalletConnected = createAsyncThunk(
  "web3/isWalletConnected",
  async () => {
    const { ethereum } = window;

    if (!ethereum) {
      return throwError("Make sure you have Metamask!");
    } else {
      console.log("Ethereum object loaded: ", ethereum);
      ethereum.on("chainChanged", (_chainId: string) =>
        window.location.reload()
      );
    }

    const accounts = (await ethereum.request({
      method: "eth_accounts",
    })) as string[];

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Has authorized account: ", account);

      const chainId = (await ethereum.request({
        method: "eth_chainId",
      })) as BigInteger;

      return { account, isOnRinkeby: chainId.toString() === "0x4" };
    } else {
      return throwError("No authorized account found");
    }
  }
);

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
      method: "eth_requestAccounts",
    })) as string[];

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Connected to account: ", account);

      const chainId = (await ethereum.request({
        method: "eth_chainId",
      })) as BigInteger;

      return { account, isOnRinkeby: chainId.toString() === "0x4" };
    } else {
      return throwError("No authorized account found");
    }
  }
);

// declaring the types for our state
export type Web3State = {
  isCurrentlyConnectingToEthereum: boolean;
  isOnRinkeby: boolean;
  etherifyContractAbi: typeof CONTRACT_ABI;
  etherifyContractAddress: string;
  maybeAuthorizedWallet: string | undefined;
};

const initialState: Web3State = {
  isCurrentlyConnectingToEthereum: false,
  isOnRinkeby: false,
  etherifyContractAbi: CONTRACT_ABI,
  etherifyContractAddress: CONTRACT_ADDRESS,
  maybeAuthorizedWallet: undefined,
};

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {},
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
        state.maybeAuthorizedWallet = action.payload.account;
        state.isOnRinkeby = action.payload.isOnRinkeby;
      })
      .addCase(isWalletConnected.pending, (state, _action) => {
        state.isCurrentlyConnectingToEthereum = true;
      })
      .addCase(isWalletConnected.rejected, (state, _action) => {
        state.isCurrentlyConnectingToEthereum = false;
        state.maybeAuthorizedWallet = undefined;
      })
      .addCase(isWalletConnected.fulfilled, (state, action) => {
        state.isCurrentlyConnectingToEthereum = false;
        state.maybeAuthorizedWallet = action.payload.account;
        state.isOnRinkeby = action.payload.isOnRinkeby;
      });
  },
});

// Return `true` if there's a connected wallet.
export const selectIsAuthorized = (state: RootState) =>
  !!state.web3.maybeAuthorizedWallet;

// Get the authorized wallet address, if it exists. Else, `undefined`.
export const selectAuthorizedWallet = (state: RootState) =>
  state.web3.maybeAuthorizedWallet;

// Get the Etherify contract address.
export const selectContractAddress = (state: RootState) =>
  state.web3.etherifyContractAddress;

// Return `true` if we're in the process of connecting.
export const selectIsCurrentlyConnectingToEthereum = (state: RootState) =>
  state.web3.isCurrentlyConnectingToEthereum;

// Return `true` if we're in the process of connecting.
export const selectIsOnRinkeby = (state: RootState) => state.web3.isOnRinkeby;

// Get the Etherify contract ABI.
export const selectContractAbi = (state: RootState) =>
  state.web3.etherifyContractAbi;

// Reducer
export const web3Reducer = web3Slice.reducer;
