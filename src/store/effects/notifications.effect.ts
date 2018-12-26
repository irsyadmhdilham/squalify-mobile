import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { ActionTypes, InitSucceed, actionsUnion } from "../actions/notifications.action";
import { NotificationProvider } from "../../providers/notification/notification";

@Injectable()
export class NotificationsEffect {

  @Effect()
  notifications: Observable<actionsUnion> = this.actions$.pipe(
    ofType(ActionTypes.init),
    switchMap(() => {
      return this.notificationProvider.getNotifsReadTotal().pipe(
        map(value => new InitSucceed(value))
      )
    })
  );

  constructor(private actions$: Actions, private notificationProvider: NotificationProvider) { }
}