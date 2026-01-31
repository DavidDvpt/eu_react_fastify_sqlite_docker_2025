import { createAsyncThunk } from "@reduxjs/toolkit";
import meApi from "./services/network/meApi";

const authMeThunk = createAsyncThunk("auth/authMeThunk", async () => {
  const response = await meApi();

  return response;
});

export { authMeThunk };
