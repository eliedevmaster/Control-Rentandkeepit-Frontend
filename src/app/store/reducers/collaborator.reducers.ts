import { CollaboratorActionTypes, CollaboratorActions } from '../actions/collaborator.action';
import { Collaborator } from '../../models/collaboratormanagement/collaborator';

export interface State {
  collaborator: Collaborator | null;
  errorMessage: string | null; 
}

export const initialState: State = {
  collaborator: JSON.parse(localStorage.getItem('collaborator')),
  errorMessage: '',
};

export function reducer(state = initialState, action: CollaboratorActions): State {
  switch (action.type) {
    case CollaboratorActionTypes.REGISTER_COMPLETE: {
      return {
        ...state,
        collaborator: new Collaborator(action.payload.collaborator)
      };
    }
    
    case CollaboratorActionTypes.REGISTER_ERROR: {
      return {
        ...state,
        errorMessage: 'Incorrect collaborator or emolyee data.'
      };
    }

    case CollaboratorActionTypes.UPDATE_COMPLETE: {
      return {
        ...state,
        collaborator: new Collaborator(action.payload.collaborator)
      };
    }
    
    case CollaboratorActionTypes.UPDATE_ERROR: {
      return {
        ...state,
        errorMessage: 'Incorrect collaborator or emolyee data.'
      };
    }

    case CollaboratorActionTypes.GET_CURRENT_COLLABORATOR_COMPLETE: {
      return {
        ...state,
        collaborator: new Collaborator(action.payload.collaborator)
      };
    }

    default: {
      return state;
    }
  }
}

export const selectCollaborator = (state: State)  => state.collaborator;