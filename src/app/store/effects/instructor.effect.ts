import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { InstructorActionTypes, RegisterInstructor, RegisterInstructorComplete, RegisterInstructorError,
         UpdateInstructor, UpdateInstructorComplete, UpdateInstructorError,
         GetCurrentInstructor, GetCurrentInstructorComplete } from '../actions/instructor.action';

import { SetActive } from '../actions/auth.action';

import { of } from 'rxjs';
import { InstructorService } from '../../core/services/instructor.service';
import { Instructor } from '../../models/instructormanagement/instructor';
import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Injectable()
export class InstructorEffects
{
    /**
     * Constructor
     *
     * @param {Actions} actions$
     */
    constructor(
        private actions$: Actions,
        private instructorService: InstructorService,
        private store: Store<AppState>, 
    )
    {
    }

    @Effect()
    register$ = this.actions$.pipe(
      ofType(InstructorActionTypes.REGISTER),
      map((action: RegisterInstructor) => action.payload),
      switchMap(payload => {
        return this.instructorService.registerInstructor( payload.instructor )
            .pipe(
              map((InstructorData) => {
                //console.log("res : " + InstructorData);
                localStorage.setItem('instructor', JSON.stringify(new Instructor(InstructorData)));
                Swal.fire('Yes!', 'Registeration was succeded!', 'success');
                this.store.dispatch(new SetActive({role_relation_id: InstructorData.id}));
                return new RegisterInstructorComplete({ instructor : new Instructor(InstructorData) });
              }),
              catchError((error: Error) => {
                Swal.fire('Ooops!', 'Sorry, reegisteration was failed!', 'error');
                return of(new RegisterInstructorError({ errorMessage: error.message }));
              })
            );
      })
    );
    

    @Effect()
    update$ = this.actions$.pipe(
      ofType(InstructorActionTypes.UPDATE),
      map((action: UpdateInstructor) => action.payload),
      switchMap(payload => {
        return this.instructorService.updateInstructor( payload.instructor )
            .pipe(
              map((InstructorData) => {
                localStorage.setItem('instructor', JSON.stringify(new Instructor(InstructorData)));
                Swal.fire('Yes!', 'The Instructor information was successfully updated!', 'success');
                return new UpdateInstructorComplete({ instructor : new Instructor(InstructorData) });
              }),
              catchError((error: Error) => {
                Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                return of(new UpdateInstructorError({ errorMessage: error.message }));
              })
            );
      })
    );

    @Effect()
    getCurrentInstructor$ = this.actions$.pipe(
      ofType(InstructorActionTypes.GET_CURRENT_INSTRUCTOR),
      map((action: GetCurrentInstructor) => action.payload),
      switchMap((payload) => {
        return this.instructorService.getCurrentInstructor(payload.userId)
            .pipe(
              map((InstructorData) => {
                localStorage.setItem('instructor', JSON.stringify(new Instructor(InstructorData)));
                return new GetCurrentInstructorComplete({ instructor : InstructorData });
              }),
            );
      })
    );
  
}
