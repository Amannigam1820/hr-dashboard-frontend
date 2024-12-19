import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  //  updatedUser:null,
  loader: true,
  isLoggedIn : false,
  filters : null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
      state.isLoggedIn = true;
    },
    userNotExist: (state, action) => {
      state.user = null;
      state.loader = true;
      state.isLoggedIn = false
    },
    filterExists : (state, action)=>{
      state.filters = action.payload
    }
  },
});

export default userSlice;

export const { userExists, userNotExist , filterExists} = userSlice.actions;
