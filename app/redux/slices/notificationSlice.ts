import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

let id = 0;

const mkUniqId = () => id++;

export type TNotificationType = "success" | "error";

type TNotificationData = {
  message: string;
  title: string;
  type: TNotificationType;
};

export type TNotification = TNotificationData & {
  id: number;
};

export type NotificationState = {
  notifications: TNotification[];
};

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<TNotificationData>) => {
      const notification = { ...action.payload, id: mkUniqId() };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      const newNotifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
      state.notifications = newNotifications;
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;

// Get the current notifications.
export const selectNotifications = (state: RootState) =>
  state.notification.notifications;

// Reducer
export const notificationReducer = notificationSlice.reducer;
