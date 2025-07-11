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

export interface IModel {
  id: number;
  name: string;
  description: string;
  image?: File | null;
  model?: File | null;
}
