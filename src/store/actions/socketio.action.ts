import { Action } from '@ngrx/store';

export enum ActionTypes {
  init = 'SOCKET_IO_INSTANCE',
  reset = 'SOCKET_IO_RESET'
};

export class SocketioInit implements Action {
  readonly type = ActionTypes.init;

  constructor(public payload: any) { }
}

export class SocketioReset implements Action {
  readonly type = ActionTypes.reset;
}

export type actionsUnion = SocketioInit | SocketioReset;