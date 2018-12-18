import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { ActionUnion } from "../actions/agency.action";

import { ActionTypes, FetchAgencySuccess } from "../actions/agency.action";
import { AgencyProvider } from "../../providers/agency/agency";

@Injectable()
export class AgencyEffect {

  @Effect()
  agency: Observable<ActionUnion> = this.actions$.pipe(
    ofType(ActionTypes.agencyFetch),
    switchMap(() => {
      return this.agencyProvider.getAgencyDetail(1, 'pk,name,agency_image,company').pipe(
        map(data => new FetchAgencySuccess(data))
      )
    })
  )

  constructor(private actions$: Actions, private agencyProvider: AgencyProvider) { }

}