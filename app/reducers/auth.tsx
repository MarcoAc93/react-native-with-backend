import { User } from "../types";

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  token: string | null;
  errorMessage: string;
  user: User | null;
};

export type AuthActions = 
  | { type: 'signUp', payload: { token: string, user: User } }
  | { type: 'addError', paylaod: string }
  | { type: 'removeError' }
  | { type: 'notAuthenticated' }
  | { type: 'logout' };

export const authReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch(action.type) {
    case 'addError':
      return {
        ...state,
        status: 'not-authenticated',
        token: null,
        user: null,
        errorMessage: action.paylaod,
      };
    case 'removeError':
      return {
        ...state,
        errorMessage: '',
      };
    case 'signUp':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        errorMessage: '',
        status: 'authenticated'
      };
    case 'logout':
      return {
        ...state,
        status: 'not-authenticated',
        token: null,
        errorMessage: '',
        user: null,
      };
    case 'notAuthenticated':
      return {
        ...state,
        status: 'not-authenticated',
        token: null,
        user: null,
        errorMessage: '',
      }
    default:
      return state;
  }
};
