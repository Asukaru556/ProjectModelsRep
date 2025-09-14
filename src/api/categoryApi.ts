import {api} from "src/api/api";
import type {CreateCategory, ICategory} from "components/models";


const baseURL = '/categories'

export function createCategoryApi(data: CreateCategory) {
  return api.post<ICategory>(`${baseURL}/add`, data)
}

export function getCategoriesApi() {
  return api.get<ICategory[]>(`${baseURL}`)
}

export function getCategoryApi(id: number) {
  return api.get<ICategory>(`${baseURL}/${id}`)
}

export function updateCategoryApi(id: number, data: CreateCategory) {
  return api.put<ICategory>(`${baseURL}/${id}`, data)
}

export function deleteCategoryApi(id: number) {
  return api.delete<void>(`${baseURL}/${id}`)
}

export const modelApi = {
  createCategoryApi,
  getCategoriesApi,
  getCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
}
