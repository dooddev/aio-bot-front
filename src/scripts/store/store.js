import { configureStore } from "@reduxjs/toolkit";
import { apiService } from "../instance/axiosBaseQuery";
import appSlices from "./slices/app/app-slices";
import chatSlice from "./slices/chat/chat-slice";
import friendSlice from "./slices/friend/friend-slice";

const store = configureStore({
  reducer: {
    app: appSlices,
    chat: chatSlice,
    friend: friendSlice,
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});

export default store;
