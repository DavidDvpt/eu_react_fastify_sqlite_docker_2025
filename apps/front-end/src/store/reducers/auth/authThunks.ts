import meApi from "@/modules/auth/services/network/meApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const authMeThunk = createAsyncThunk("auth/authMeThunk", async () => {
  const response = await meApi();

  return response;
});

export { authMeThunk };
