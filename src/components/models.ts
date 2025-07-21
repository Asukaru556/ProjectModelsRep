export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface NewModel {
  id?: number;
  title: string;
  description: string;
  image_path: string | null;
  model_path: string | null;
  price: number | null;
  direct_purchase_url: string;
  category_id?: number | null;
  tempImage: File | null;
  tempModel: File | null;
};

export interface ModelFromAPI {
  id: number;
  title: string;
  description: string;
  image_path: string | undefined;
  model_path: string | undefined;
  price: number;
  direct_purchase_url: string;
  category_id: number;
}

export interface CategoryOption {
  id: number;
  name: string;
}

