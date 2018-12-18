import { StoreModule, ActionReducer } from "@ngrx/store";
import { storeLogger, LoggerOptions } from "ngrx-store-logger";
import { isDevMode } from "@angular/core";

import { reducers } from "./reducers";

function logger(reducer: ActionReducer<any>) {
  const loggerOptions: LoggerOptions = {
    collapsed: true
  };
  return storeLogger(loggerOptions)(reducer);
}

const metaReducers = isDevMode() ? [logger] : [];

export const storeModule = StoreModule.forRoot(reducers, { metaReducers });