import { defineStore } from 'pinia'
import type { ICategory, CreateCategory } from 'components/models'
import { ref } from 'vue'
import { modelApi } from 'src/api/categoryApi'

export const useCategoriesStore = defineStore('category', () => {
  const categories = ref<ICategory[]>([])

  const fetchCategories = async () => {
    try {
      const data = await modelApi.getCategoriesApi()
      categories.value = data
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error)
    }
  }

  const fetchCategory = async (id: number) => {
    try {
      const data = await modelApi.getCategoryApi(id)
      return data
    } catch (error) {
      console.error('Ошибка при загрузке категории:', error)
      return null
    }
  }

  const createCategory = async (payload: CreateCategory) => {
    try {
      await modelApi.createCategoryApi(payload)
      await fetchCategories()
    } catch (error) {
      console.error('Ошибка при добавлении категории:', error)
    }
  }

  const updateCategory = async (id: number, payload: CreateCategory) => {
    try {
      await modelApi.updateCategoryApi(id, payload)
      await fetchCategories()
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error)
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      await modelApi.deleteCategoryApi(id)
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Ошибка при удалении категории:', error)
    }
  }

  return {
    categories,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
