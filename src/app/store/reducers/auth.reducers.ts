import { AuthActionTypes, AuthActions } from '../actions/auth.action';
import { User } from '../../models/user';
import { Permission } from '../../models/companymanagement/permission';

export interface State {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, token should not be empty
  user: User | null;
  token: string | null;
 
  //permissions: Array<Permission> | null; 
  errorMessage: string | null; 
}

export const initialState: State = {
  isAuthenticated: false,
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  errorMessage: '',
};

export function reducer(state = initialState, action: AuthActions): State {
  switch (action.type) {
    case AuthActionTypes.LOGIN_COMPLETE: {
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          uuid: action.payload.uuid,
          email: action.payload.email,
          role: action.payload.role,
          image_path: action.payload.image_path,
          active: 0,
          role_relation_id: 0,
        },
      };
    }
    
    case AuthActionTypes.LOGIN_ERROR: {
      return {
        ...state,
        errorMessage: action.payload.errorMessage
      };
    }
    
    case AuthActionTypes.SIGNUP_COMPLETE: {
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          uuid: action.payload.uuid,
          role: action.payload.role,
          active: 0,
          role_relation_id: 0,
        },
      };
    }

    case AuthActionTypes.SIGNUP_ERROR: {
      return {
        ...state,
        errorMessage: 'SignUp failed',
      }
    }

    case AuthActionTypes.GET_CURRENT_USER_COMPLETE : {
      return {
        ...state,
        user : action.payload.user,
      }
    }
   
    case AuthActionTypes.RESET_PASSWORD_COMPLETE: {
      return {
        ...state,
        errorMessage : action.payload.message
      }
    }

    case AuthActionTypes.RESET_PASSWORD_ERROR: {
      return {
        ...state,
        errorMessage : action.payload.errorMessage
      }
    }

    case AuthActionTypes.LOGOUT: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const selectAuthToken = (state: State)  => state.token;