import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ProductsContext } from '../context/products';
import { AuthContext } from '../context/auth';

interface ProductsProps extends StackScreenProps<any, any> {};

export const Products = ({ navigation }: ProductsProps) => {
  const { products, isFetching, onRefresh } = useContext(ProductsContext);
  const { logOut } = useContext(AuthContext)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Product', { })}>
            <Text>Add Product</Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={logOut}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.renderItemContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Product', { id: item._id, name: item.nombre })}>
              <Text>{item.nombre}</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  renderItemContainer: {
    paddingVertical: 10
  },
  separator: {
    borderBottomColor: 'black',
    borderTopWidth: 1,
  }
});
