import { Injectable } from "@angular/core";
import { Effect, ofType, Actions } from "@ngrx/effects";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { actionsUnion, ActionTypes, PointInitSucceed } from "../actions/points.action";
import { PointProvider } from "../../providers/point/point";

@Injectable()
export class PointsEffect {

  @Effect()
  points$: Observable<actionsUnion> = this.actions$.pipe(
    ofType(ActionTypes.init),
    switchMap(() => {
      return this.pointProvider.getAllPoints().pipe(
        map(value => new PointInitSucceed(value))
      )
    })
  )

  constructor(private actions$: Actions, private pointProvider: PointProvider) { }
}