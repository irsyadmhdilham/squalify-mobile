import { StoreModule, ActionReducer } from "@ngrx/store";
import { storeLogger, LoggerOptions } from "ngrx-store-logger";
import { reducers } from "../store/reducers/all-reducers";
const isProd = true;

function logger(reducer: ActionReducer<any>) {
  const loggerOptions: LoggerOptions = {
    collapsed: true
  };
  return storeLogger(loggerOptions)(reducer);
}

const metaReducers = isProd ? [] : [logger];

export const storeModule = StoreModule.forRoot(reducers, { metaReducers });