import { Action } from '@ngrx/store';
import { Instructor } from '../../models/instructormanagement/instructor';

export enum InstructorActionTypes {
  REGISTER = '[Instructor] REGISTER',
  REGISTER_COMPLETE = '[Instructor] REGISTER_COMPLETE',
  REGISTER_ERROR = '[Instructor] REGISTER_ERROR',

  UPDATE = '[Instructor] UPDATE',
  UPDATE_COMPLETE = '[Instructor] UPDATE_COMPLETE',
  UPDATE_ERROR = '[Instructor] UPDATE_ERROR',
  
  GET_CURRENT_INSTRUCTOR = '[Instructor] GET_CURRENT_INSTRUCTOR',
  GET_CURRENT_INSTRUCTOR_COMPLETE = '[Instructor] GET_CURRENT_INSTRUCTOR_COMPLETE'
}

export class RegisterInstructor implements Action {
    readonly type = InstructorActionTypes.REGISTER;  
    constructor(public payload: {instructor: Instructor}) {}
}
  
export class RegisterInstructorComplete implements Action {
    readonly type = InstructorActionTypes.REGISTER_COMPLETE;
    constructor(public payload: {instructor: Instructor}) {}
}
  
export class RegisterInstructorError implements Action {
    readonly type = InstructorActionTypes.REGISTER_ERROR;
    constructor(public payload: {errorMessage: string}) {}
}

export class UpdateInstructor implements Action {
    readonly type = InstructorActionTypes.UPDATE;  
    constructor(public payload: { instructor: Instructor }) {};
}
  
export class UpdateInstructorComplete implements Action {
    readonly type = InstructorActionTypes.UPDATE_COMPLETE;
    constructor(public payload: { instructor: Instructor }) {};
}
  
export class UpdateInstructorError implements Action {
    readonly type = InstructorActionTypes.UPDATE_ERROR;
    constructor(public payload: { errorMessage: string }) {};
}

export class GetCurrentInstructor implements Action {
    readonly type = InstructorActionTypes.GET_CURRENT_INSTRUCTOR;
    constructor(public payload: { userId: number }) {};
}

export class GetCurrentInstructorComplete implements Action {
    readonly type = InstructorActionTypes.GET_CURRENT_INSTRUCTOR_COMPLETE;
    constructor(public payload: { instructor: Instructor }) {};
}

export type InstructorActions
 = RegisterInstructor
 | RegisterInstructorComplete
 | RegisterInstructorError
 | UpdateInstructor
 | UpdateInstructorComplete
 | UpdateInstructorError
 | GetCurrentInstructor
 | GetCurrentInstructorComplete;;