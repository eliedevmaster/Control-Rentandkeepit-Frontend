import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Action } from '@ngrx/store';
import { Permission } from 'app/models/companymanagement/permission';

export enum AuthActionTypes {
  LOGIN = '[Auth] LOGIN',
  LOGIN_COMPLETE = '[Auth] LOGIN_COMPLETE',
  LOGIN_ERROR = '[Auth] LOGIN_ERROR',

  SIGNUP = '[Auth] SIGNUP',
  SIGNUP_COMPLETE = '[Auth] SIGNUP_COMPLETE',
  SIGNUP_ERROR = '[Auth] SIGNUP_ERROR',
  
  RESET_PASSWORD = '[Auth] RESET_PASSWORD',
  RESET_PASSWORD_COMPLETE = '[Auth] RESET_PASSWORD_COMPLETE',
  RESET_PASSWORD_ERROR = '[Auth] RESET_PASSWORD_ERROR',

  SET_ACTIVE = '[Auth] SET_ACTIVE',

  LOGOUT = '[Auth] LOGOUT'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;  
  constructor(public payload: { email: string, password: string }) {}
}

export class LoginComplete implements Action {
  readonly type = AuthActionTypes.LOGIN_COMPLETE;
  constructor(public payload: { token: string, id: number, name: string, email: string, role: string, active: number, role_relation_id: number, permissions: Array<Permission> }) {}
}

export class LoginError implements Action {
  readonly type = AuthActionTypes.LOGIN_ERROR;
  constructor(public payload: { errorMessage: string }) {}
}


export class Signup implements Action {
  readonly type = AuthActionTypes.SIGNUP;
  constructor(public payload: { name:string, email: string, password: string, password_confirmation: string }) {};
}

export class SignupError implements Action {
  readonly type = AuthActionTypes.SIGNUP_ERROR;
  constructor (public payload: { errorMessage: string }) {};
}

export class SignupComplete implements Action {
  readonly type = AuthActionTypes.SIGNUP_COMPLETE;
  constructor (public payload: { token: string, id: number, name: string, email: string, role:string, role_relation_id: number, permissions: Array<Permission> }) {};
}

export class ResetPassword implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD;
  constructor (public payload: { current_password: string, password: string, password_confirmation: string }) {};
}

export class ResetPasswordComplete implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD_COMPLETE;
  constructor (public payload: { message : string }) {};  
}

export class ResetPasswordError implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD_ERROR;
  constructor (public payload: { errorMessage : string }) {};
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class SetActive implements Action {
  readonly type = AuthActionTypes.SET_ACTIVE;
  constructor (public payload: {role_relation_id : number}) {}
}

export type AuthActions
 = Login
 | LoginComplete
 | LoginError
 | Signup
 | SignupError
 | SignupComplete
 | ResetPassword
 | ResetPasswordComplete
 | ResetPasswordError
 | Logout
 | SetActive;