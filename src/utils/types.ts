export type IngredientType = 'bun' | 'sauce' | 'main';

export interface Ingredient {
  _id: string;
  name: string;
  type: IngredientType;
  price: number;
  image: string;
  image_mobile?: string;
  image_large?: string;
  calories?: number;
  proteins?: number;
  fat?: number;
  carbohydrates?: number;
  count?: number;
  __v?: number;
}

export interface ConstructorIngredient extends Ingredient {
  uuid: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Order {
  number: number;
  name?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  ingredients?: string[];
}

export interface User {
  email: string;
  name: string;
}

export interface FormValues {
  [key: string]: string;
}
