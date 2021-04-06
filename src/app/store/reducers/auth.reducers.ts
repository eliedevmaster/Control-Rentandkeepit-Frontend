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
  //permissions: JSON.parse(localStorage.getItem('my_permissions')),
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
          email: action.payload.email,
          role: action.payload.role,
          active: action.payload.active,
          role_relation_id : action.payload.role_relation_id,
          permissions: action.payload.permissions,
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
          role: action.payload.role,
          active: 0,
          role_relation_id: action.payload.role_relation_id,
          permissions: action.payload.permissions,
        },
        
      };
    }

    case AuthActionTypes.SIGNUP_ERROR: {
      return {
        ...state,
        errorMessage: 'SignUp failed',
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

    case AuthActionTypes.SET_ACTIVE: {
      console.log("dddddd");
      return {
        ...state,
        user: {
          ...state.user,
          role_relation_id: action.payload.role_relation_id,
          active : 1
        }
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