import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { ProductsProvider } from "../context/products";
import { Product } from "../screens/Product";
import { Products } from "../screens/Products";

export type ProductsStackParams = {
  Products: undefined;
  Product: { id?: string; name?: string };
};

const Stack = createStackNavigator<ProductsStackParams>();

const ProductsStateProvider = ({ children }: { children: JSX.Element }) => (
  <ProductsProvider>
    {children}
  </ProductsProvider>
);

export const ProductsStackNavigator = () => {
  return (
    <ProductsStateProvider>
      <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: 'white' }, headerStyle: { elevation: 0, shadowColor: 'transparent'} }}>
        <Stack.Screen name='Products' component={Products} />
        <Stack.Screen name='Product' component={Product} />
      </Stack.Navigator>
    </ProductsStateProvider>
  );
};
