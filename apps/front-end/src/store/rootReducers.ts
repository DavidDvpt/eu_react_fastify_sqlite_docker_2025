import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../modules/auth";
const reducers = combineReducers({ auth: authReducer });

export default reducers;
