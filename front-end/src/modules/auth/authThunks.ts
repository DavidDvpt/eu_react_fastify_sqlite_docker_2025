import { createAsyncThunk } from "@reduxjs/toolkit";
import me from "./services/network/me";

const authMeThunk = createAsyncThunk("auth/authMeThunk", async () => {
  const response = await me();

  return response;
});

export { authMeThunk };
