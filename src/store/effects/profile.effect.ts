import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { ActionUnion } from "../actions/profile.action";

import { ActionTypes, FetchSucceed } from "../actions/profile.action";
import { ProfileProvider } from "../../providers/profile/profile";

@Injectable()
export class ProfileEffect {

  @Effect()
  profile: Observable<ActionUnion> = this.actions$.pipe(
    ofType(ActionTypes.fetch),
    switchMap(() => {
      return this.profileProvider.getProfile().pipe(
        map(data => new FetchSucceed(data))
      )
    })
  )

  constructor(private actions$: Actions, private profileProvider: ProfileProvider) { }

}