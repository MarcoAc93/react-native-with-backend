import React, { useEffect, useContext, useState } from 'react';
import { Image, View, Text, StyleSheet, ScrollView, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { ProductsStackParams } from '../navigation/ProductsStack';
import { Category } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/products';

interface ProductProps extends StackScreenProps<ProductsStackParams, 'Product'> {};

export const Product = ({ navigation, route }: ProductProps) => {
  const { id = '', name = '' } = route.params;
  const [imgTemp, setImgTemp] = useState('');

  const { _id, categoriaId, nombre, img, onChange, setFormValue } = useForm({ _id: id, nombre: name, categoriaId: '', img: '' });
  const { categories, isFetching } = useCategories();
  const { loadProductById, updateProduct, addProduct, deleteProduct, uploadImage } = useContext(ProductsContext);

  const fetchProduct = async () => {
    if (id.length === 0) return;
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre
    });
  };

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      await updateProduct(categoriaId, nombre, id);
    } else {
      if (categoriaId.length === 0) onChange(categories[0]._id, 'categoriaId');
      const temp = categoriaId || categories[0]._id;
      await addProduct(temp, nombre);
    }
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel || response.errorCode === 'camera_unavailable') return;
      if (response.assets?.length === 0) return;
      const { assets } = response;
      const [imageInfo] = assets;
      setImgTemp(imageInfo.uri!);
      uploadImage(imageInfo, _id);
    })
  };

  const choosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) return;
      if (response.assets?.length === 0) return;
      const { assets } = response;
      const [imageInfo] = assets;
      setImgTemp(imageInfo.uri!);
      uploadImage(imageInfo, _id);
    })
  }

  useEffect(() => {
    fetchProduct();

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.5} onPress={() => deleteProduct(id)}>
          <Text style={{ marginRight: 20, color: 'red' }}>Delete</Text>
        </TouchableOpacity>
      )
    })
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: nombre ? nombre : 'Name of the product'
    });
  }, [nombre]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Product name</Text>
        <TextInput
          placeholder='Product'
          style={styles.textInput}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        <Text style={styles.label}>Category</Text>
          {isFetching
            ? <ActivityIndicator size={15} color='#5856D6' />
            : (
              <Picker selectedValue={categoriaId} onValueChange={value => onChange(value, 'categoriaId')}>
                {categories.map((category: Category) => (
                  <Picker.Item
                    key={category._id}
                    label={category.nombre}
                    value={category._id}
                  />
                ))}
              </Picker>
            )
          }
        <Button title='Save' onPress={saveOrUpdate} color='#5856D6' />

        {id.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <Button title='Camera' onPress={takePhoto} color='#5856D6' />
            <View style={{ width: 20 }} />
            <Button title='Galery' onPress={choosePhoto} color='#5856D6' />
          </View>
        )}
        
        {(img.length > 0 && !imgTemp) && <Image source={{ uri: img }} style={styles.imgStyle} />}
        {imgTemp.length > 0 && <Image source={{ uri: imgTemp }} style={styles.imgStyle} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20
  },
  label: {
    fontSize: 18
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 10,
    marginBottom: 20
  },
  imgStyle: {
    width: '100%',
    height: 300,
    marginTop: 20
  }
});
