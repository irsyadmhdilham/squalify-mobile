import { Action } from '@ngrx/store';

export enum ActionTypes {
  init = 'SOCKET_IO_INSTANCE'
};

export class SocketioInit implements Action {
  readonly type = ActionTypes.init;

  constructor(public payload: any) { }
}

export type actionsUnion = SocketioInit;