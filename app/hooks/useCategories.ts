import { useEffect, useState } from "react";
import Api from "../api";
import { CategoriesResponse, Category } from "../types";

type useCategoriesType = {
  categories: Category[];
  isFetching: boolean;
}

export const useCategories = (): useCategoriesType => {
  const [isFetching, setIsFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      const response = await Api.get<CategoriesResponse>('/categorias');
      const { data } = response;
      setCategories(data.categorias);
      setIsFetching(false);
    } catch (error) {
      console.log(error.response.data);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isFetching
  };
};
