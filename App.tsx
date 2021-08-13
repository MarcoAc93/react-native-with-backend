import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from './app/navigation/StackNavigation';
import { AuthProvider } from './app/context/auth';

const AppState = ({ children }: { children: JSX.Element}) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <StackNavigation />
      </AppState>
    </NavigationContainer>
  );
};

export default App;
