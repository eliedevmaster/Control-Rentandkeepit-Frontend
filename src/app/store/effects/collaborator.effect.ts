import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { CollaboratorActionTypes, RegisterCollaborator, RegisterCollaboratorComplete, RegisterCollaboratorError,
         UpdateCollaborator, UpdateCollaboratorComplete, UpdateCollaboratorError,
         GetCurrentCollaborator, GetCurrentCollaboratorComplete } from '../actions/collaborator.action';
import { SetActive } from '../actions/auth.action';

import { of } from 'rxjs';
import { CollaboratorService } from '../../core/services/collaborator.service';
import { Collaborator } from '../../models/collaboratormanagement/collaborator';
import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Injectable()
export class CollaboratorEffects
{
    /**
     * Constructor
     *
     * @param {Actions} actions$
     */
    constructor(
        private actions$: Actions,
        private collaboratorService: CollaboratorService,
        private store: Store<AppState>,
    )
    {
    }

    @Effect()
    register$ = this.actions$.pipe(
      ofType(CollaboratorActionTypes.REGISTER),
      map((action: RegisterCollaborator) => action.payload),
      switchMap(payload => {
        return this.collaboratorService.registerCollaborator( payload.collaborator )
            .pipe(
              map((collaboratorData) => {
                Swal.fire('Yes!', 'Registeration was succeded!', 'success');
                localStorage.setItem('collaborator', JSON.stringify(new Collaborator(collaboratorData)));
                this.store.dispatch(new SetActive({role_relation_id: collaboratorData.id}));
                return new RegisterCollaboratorComplete({ collaborator : new Collaborator(collaboratorData) });
              }),
              catchError((error: Error) => {
                Swal.fire('Ooops!', 'Sorry, reegisteration was failed!', 'error');
                return of(new RegisterCollaboratorError({ errorMessage: error.message }));
              })
            );
      })
    );

    @Effect()
    update$ = this.actions$.pipe(
      ofType(CollaboratorActionTypes.UPDATE),
      map((action: UpdateCollaborator) => action.payload),
      switchMap(payload => {
        return this.collaboratorService.updateCollaborator( payload.collaborator )
            .pipe(
              map((collaboratorData) => {
                localStorage.setItem('collaborator', JSON.stringify(new Collaborator(collaboratorData)));
                Swal.fire('Yes!', 'The Collaborator information was successfully updated!', 'success');
                return new UpdateCollaboratorComplete({ collaborator : new Collaborator(collaboratorData) });
              }),
              catchError((error: Error) => {
                Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                return of(new UpdateCollaboratorError({ errorMessage: error.message }));
              })
            );
      })
    );

    @Effect()
    getCurrentCollaborator$ = this.actions$.pipe(
      ofType(CollaboratorActionTypes.GET_CURRENT_COLLABORATOR),
      map((action: GetCurrentCollaborator) => action.payload),
      switchMap((payload) => {
        return this.collaboratorService.getCurrentCollaborator(payload.userId)
            .pipe(
              map((collaboratorData) => {
                //console.log("current_Collaborator : " + CollaboratorData);
                localStorage.setItem('collaborator', JSON.stringify(new Collaborator(collaboratorData)));
                return new GetCurrentCollaboratorComplete({ collaborator : collaboratorData });
              }),
            );
      })
    );
  
}
