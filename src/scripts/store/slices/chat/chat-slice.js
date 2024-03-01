import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "appReducer",
  initialState: {
    me: null,
    messages: [],
  },
  reducers: {
    setMe: (state, action) => {
      state.me = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = [...action.payload];
    },
    addMessages: (state, action) => {
      state.messages = [...state.messages, ...action.payload];
    },
  },
});

export const { setMe, setMessages, addMessages } = chatSlice.actions;

export default chatSlice.reducer;
