import React from 'react';
import { useReducer, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api';
import { authReducer, AuthState } from '../reducers/auth';
import { LoginResponse, User } from '../types';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: User | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (payload: {correo: string, password: string, nombre: string }) => void;
  signIn: (payload: {correo: string, password: string }) => void;
  removeError: () => void;
  logOut: () => void;
};

const authInitialState: AuthState = {
  errorMessage: '',
  status: 'checking',
  token: null,
  user: null,
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  const signIn = async (payload: { correo: string, password: string }) => {
    try {
      const response = await Api.post<LoginResponse>('/auth/login', payload);
      const { data } = response;
      dispatch({ type: 'signUp', payload: { token: data.token, user: data.usuario } });
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      let errorString = '';
      if (error.response.data.errors) {
        errorString = error.response.data.errors.map((error: any) => error.msg).join(', ');
        dispatch({ type: 'addError', paylaod: errorString });
        return;
      }
      dispatch({ type: 'addError', paylaod: error.response.data.msg || 'Wrong info' });
    }
  };
  
  const signUp = async (payload: { correo: string, password: string, nombre: string }) => {
    try {
      const response = await Api.post<LoginResponse>('/usuarios', payload);
      const { data } = response;
      dispatch({ type: 'signUp', payload: { token: data.token, user: data.usuario }});
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      const errors = error.response.data.errors.map((error: any) => error.msg).join(', ');
      dispatch({ type: 'addError', paylaod: errors });
    }
  };
  
  const removeError = () => dispatch({ type: 'removeError' });
  
  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'logout' });
  }

  useEffect(() => {
    const validateToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return dispatch({ type: 'notAuthenticated' });

      try {
        const tokenResponse = await Api.get<LoginResponse>('/auth');
        const { data } = tokenResponse;
        dispatch({ type: 'signUp', payload: { token: data.token, user: data.usuario } });
        await AsyncStorage.setItem('token', data.token);
      } catch (error) {
        dispatch({ type: 'notAuthenticated' });
      }
    }
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, removeError, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
