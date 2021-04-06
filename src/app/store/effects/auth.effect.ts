import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { AuthActionTypes, Login, LoginComplete, LoginError, 
         Signup, SignupComplete, SignupError, 
         ResetPassword, ResetPasswordComplete, ResetPasswordError, SetActive, GetUserListComplete } from '../actions/auth.action';

import { Router } from '@angular/router';

import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Injectable()
export class AuthEffects
{
    /**
     * Constructor
     *
     * @param {Actions} actions$
     */
    constructor(
        private actions$: Actions,
        private router: Router,
        private authService: AuthService 
    )
    {
    }

    @Effect()
    login$ = this.actions$.pipe(
      ofType(AuthActionTypes.LOGIN),
      map((action: Login) => action.payload),
      switchMap(payload => {
        return this.authService.logIn(payload.email, payload.password)
            .pipe(
              map((authData) => {
                localStorage.setItem('user', JSON.stringify(new User(authData)));
                localStorage.setItem('token', authData.access_token);
                return new LoginComplete({ 
                                           token: authData.access_token,
                                           id: authData.id,
                                           name: authData.name,
                                           email: authData.email, 
                                           uuid: authData.uuid,
                                           role: authData.role, 
                                           active: authData.active,
                                           role_relation_id: authData.role_relation_id,
                                           permissions: authData.permissions,
                                        });
              }),
              catchError((error: Error) => {
                return of(new LoginError({ errorMessage: error['error']['message'] }));
              })
            );
      })
    );

 
    @Effect()
    signup$ = this.actions$.pipe(
      ofType(AuthActionTypes.SIGNUP),
      map((action: Signup) => action.payload),
      switchMap(payload => {
        return this.authService.signUp(payload.name, payload.email, payload.password, payload.password_confirmation)
            .pipe(
              map((signupData) => {
                localStorage.setItem('user', JSON.stringify(new User(signupData)));
                localStorage.setItem('token', signupData.access_token);
                Swal.fire('Yes!', 'Signup was succeded!', 'success');
                return new SignupComplete({ 
                                            token: signupData.access_token,
                                            id:  signupData.id,
                                            name: signupData.name,
                                            email:signupData.email, 
                                            uuid: signupData.uuid,
                                            role: signupData.role,
                                            role_relation_id: signupData.role_relation_id,
                                            permissions: signupData.permissions
                                          });
              }),
              catchError((error: Error) => {
                Swal.fire('Ooops!', error['error']['errors'][0], 'error');
                this.router.navigate(['/pages/auth/register']);
                return of(new SignupError({ errorMessage: "failed" }));
              })
            );
      })
    );

    @Effect({ dispatch: false })
    logout$ = this.actions$.pipe(
      ofType(AuthActionTypes.LOGOUT),
      switchMap(() => {
        return this.authService.logout().pipe(
          map((msg) => {
            localStorage.clear();
          })
        );
      })
    );

    @Effect()
    resetPassword$ = this.actions$.pipe(
      ofType(AuthActionTypes.RESET_PASSWORD),
      map((action: ResetPassword) => action.payload),
      switchMap((payload) => {  
        return this.authService.resetPassword(payload.current_password, payload.password, payload.password_confirmation).pipe(
          map((message) => {
            Swal.fire('Yes!', 'Your Password was successfully changed!', 'success');
            return new ResetPasswordComplete({ message : message.message });
          }),
          catchError((error : Error) => {

            let errorObj: any = error['error']['errors'];
            let message: string = '';
            if('old_password' in errorObj)
              message = errorObj['old_password'][0];
            else
              message = errorObj['password'][0];
    
            Swal.fire('Sorry!', message, 'error');
            return of(new ResetPasswordError({ errorMessage : message }));
          })
        );
      })
    );
    
    @Effect()
    getUserList$ = this.actions$.pipe(
      ofType(AuthActionTypes.GET_USER_LIST),
      switchMap(() => {  
        return this.authService.getUserList().pipe(
          map((userList) => {
            let userArray: Array<User> = [];
            userList.forEach(element => {
              userArray.push(element);
            });
            return new GetUserListComplete({ userList : userArray });
          }),

          catchError((error : Error) => {
            Swal.fire('Sorry!', error.message, 'error');
            return of(new ResetPasswordError({ errorMessage : error.message }));
          })
        );
      })
    );

    @Effect({dispatch: false})
    setActive$ = this.actions$.pipe(
       ofType(AuthActionTypes.SET_ACTIVE),
       map((action: SetActive) => action.payload),
       tap((payload) => {
          let user: any = JSON.parse(localStorage.getItem('user'));
          user.role_relation_id = payload.role_relation_id;
          localStorage.setItem('user', JSON.stringify(new User(user)));
       })
   );
}
