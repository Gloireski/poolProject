import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  name: string;
  email: string;
};

const initialState: UserState = {
  name: "Voyageur",
  email: "test@example.com",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
});

export const { updateProfile } = userSlice.actions;
export default userSlice.reducer;
