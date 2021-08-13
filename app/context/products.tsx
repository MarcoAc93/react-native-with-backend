import React, { createContext, useState, useEffect } from 'react';
import Api from '../api';
import { Product, ProductsResponse } from '../types';

type ProductsContextProps = {
  products: Product[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<void>;
  updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Product>;
  uploadImage: (data: any, id: string) => Promise<void>; // TODO: cambiar ANY
  isFetching: boolean;
  onRefresh: () => Promise<void>;
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const loadProducts = async () => {
    try {
      const response = await Api.get<ProductsResponse>('/productos?limite=50');
      const { data } = response;
      setProducts([...data.productos]);
      setIsFetching(false);
    } catch (error) {
      console.log(error.response.data);
      setProducts([]);
    }
  };

  const addProduct = async (categoryId: string, productName: string) => {
    try {
      const response = await Api.post<Product>('/productos', {
        nombre: productName,
        categoria: categoryId,
      });
        setProducts([...products, response.data]);
      } catch (error) {
      console.log(error.response.data);
    }
  };

  const updateProduct = async (categoryId: string, productName: string, productId: string) => {
    try {
      const response = await Api.put<Product>(`/productos/${productId}`, { nombre: productName, categoria: categoryId });
      setProducts(products.map(product => (product._id === response.data._id) ? response.data : product ));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await Api.delete(`/productos/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const loadProductById = async (id: string): Promise<Product> => {
    const response = await Api.get<Product>(`/productos/${id}`);
    return response.data;
  };

  const uploadImage = async (data: any, id: string) => {
    const fileToUpload = {
      uri: data.uri,
      type: data.type,
      name: data.fileName
    };
    const formData = new FormData();
    formData.append('archivo', fileToUpload);
    try {
      const response = await Api.put(`/uploads/productos/${id}`, formData);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const onRefresh = async () => {
    setIsFetching(true);
    await loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{
      products,
      loadProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      loadProductById,
      uploadImage,
      isFetching,
      onRefresh,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};