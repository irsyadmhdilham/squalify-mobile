import { StoreModule, ActionReducer } from "@ngrx/store";
import { storeLogger, LoggerOptions } from "ngrx-store-logger";
import { isDevMode } from "@angular/core";

import { reducers } from "../store/reducers/all-reducers";

function logger(reducer: ActionReducer<any>) {
  const loggerOptions: LoggerOptions = {
    collapsed: true
  };
  return storeLogger(loggerOptions)(reducer);
}

function metaReducers() {
  if (isDevMode()) {
    return [logger];
  }
  return [];
}

export const storeModule = StoreModule.forRoot(reducers, { metaReducers: metaReducers() });