import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// declaring the types for our state
export type AuthState = {
  authorizedWallet: string | undefined;
};

const initialState: AuthState = {
  authorizedWallet: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions.
  // In this example, 'increment', 'decrement' and 'incrementByAmount' are actions. They can be triggered from outside this slice, anywhere in the app.
  // So for example, if we make a dispatch to the 'increment' action here from the index page, it will get triggered and change the value of the state from 0 to 1.
  reducers: {
    // Authorize a wallet
    authorize: (state, action: PayloadAction<string>) => {
      state.authorizedWallet = action.payload;
    },

    // Deauthorize a wallet
    deauthorize: (state) => {
      state.authorizedWallet = undefined;
    },
  },
});

// Actions
export const { authorize, deauthorize } = authSlice.actions;

// Return `true` if there's a connected wallet.
export const selectIsAuthorized = (state: RootState) =>
  !!state.auth.authorizedWallet;

// Get the authorized wallet address, if it exists. Else, `undefined`.
export const selectAuthorizedWallet = (state: RootState) =>
  state.auth.authorizedWallet;

// Reducer
export const authReducer = authSlice.reducer;
