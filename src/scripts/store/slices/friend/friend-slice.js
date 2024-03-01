import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
  name: "appReducer",
  initialState: {
    friend_list: [],
  },
  reducers: {
    setFriends: (state, action) => {
      console.log(action);
      state.friend_list = [...action.payload];
    },
  },
});

export const { setFriends } = friendSlice.actions;

export default friendSlice.reducer;
