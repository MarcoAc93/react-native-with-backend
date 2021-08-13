import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from 'react-native-splash-screen'

import { ProductsStackNavigator } from "./ProductsStack";

import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { Loading } from "../screens/Loading";
import { AuthContext } from "../context/auth";
import { Products } from "../screens/Products";

const Stack = createStackNavigator();

const protectedRoutes = () => (
  <>
    <Stack.Screen name='ProductsNavigation' component={ProductsStackNavigator} />
    <Stack.Screen name="Products" component={Products} />
  </>
);

const unProtectedRoutes = () => (
  <>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </>
);

export const StackNavigation = () => {
  const { status } = useContext(AuthContext);
  SplashScreen.hide();
  if (status === 'checking') return <Loading />;
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: 'white' }, headerShown: false }}>
      {(status === 'authenticated') ? protectedRoutes()  : unProtectedRoutes() }
    </Stack.Navigator>
  );
}
