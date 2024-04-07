import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentUser: null,
};
export const dataSlice = createSlice({
  name: "user",

    initialState,

  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
  },
}
});
export const { setCurrentUser } = dataSlice.actions;
export default dataSlice.reducer;