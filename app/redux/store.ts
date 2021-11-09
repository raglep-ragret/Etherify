import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { notificationReducer } from "./slices/notificationSlice";
import { playlistReducer } from "./slices/playlistSlice";
import { web3Reducer } from "./slices/web3Slice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    playlist: playlistReducer,
    web3: web3Reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
