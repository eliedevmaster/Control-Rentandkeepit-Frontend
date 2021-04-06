import { Action } from '@ngrx/store';
import { Collaborator } from '../../models/collaboratormanagement/collaborator';

export enum CollaboratorActionTypes {
  REGISTER = '[Collaborator] REGISTER',
  REGISTER_COMPLETE = '[Collaborator] REGISTER_COMPLETE',
  REGISTER_ERROR = '[Collaborator] REGISTER_ERROR',

  UPDATE = '[Collaborator] UPDATE',
  UPDATE_COMPLETE = '[Collaborator] UPDATE_COMPLETE',
  UPDATE_ERROR = '[Collaborator] UPDATE_ERROR',
  
  GET_CURRENT_COLLABORATOR = '[Collaborator] GET_CURRENT_COLLABORATOR',
  GET_CURRENT_COLLABORATOR_COMPLETE = '[Collaborator] GET_CURRENT_COLLABORATOR_COMPLETE',

}

export class RegisterCollaborator implements Action {
    readonly type = CollaboratorActionTypes.REGISTER;  
    constructor(public payload: {collaborator: Collaborator}) {}
}
  
export class RegisterCollaboratorComplete implements Action {
    readonly type = CollaboratorActionTypes.REGISTER_COMPLETE;
    constructor(public payload: {collaborator: Collaborator}) {}
}
  
export class RegisterCollaboratorError implements Action {
    readonly type = CollaboratorActionTypes.REGISTER_ERROR;
    constructor(public payload: {errorMessage: string}) {}
}

export class UpdateCollaborator implements Action {
    readonly type = CollaboratorActionTypes.UPDATE;  
    constructor(public payload: { collaborator: Collaborator }) {};
}
  
export class UpdateCollaboratorComplete implements Action {
    readonly type = CollaboratorActionTypes.UPDATE_COMPLETE;
    constructor(public payload: { collaborator: Collaborator }) {};
}
  
export class UpdateCollaboratorError implements Action {
    readonly type = CollaboratorActionTypes.UPDATE_ERROR;
    constructor(public payload: { errorMessage: string }) {};
}

export class GetCurrentCollaborator implements Action {
    readonly type = CollaboratorActionTypes.GET_CURRENT_COLLABORATOR;
    constructor(public payload: { userId: number }) {};
}

export class GetCurrentCollaboratorComplete implements Action {
    readonly type = CollaboratorActionTypes.GET_CURRENT_COLLABORATOR_COMPLETE;
    constructor(public payload: { collaborator: Collaborator }) {};
}

export type CollaboratorActions
 = RegisterCollaborator
 | RegisterCollaboratorComplete
 | RegisterCollaboratorError
 | UpdateCollaborator
 | UpdateCollaboratorComplete
 | UpdateCollaboratorError
 | GetCurrentCollaborator
 | GetCurrentCollaboratorComplete;