import { authReducer } from "@/store/reducers";
import { combineReducers } from "@reduxjs/toolkit";

const reducers = combineReducers({ auth: authReducer });

export default reducers;
