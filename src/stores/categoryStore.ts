import { defineStore } from 'pinia';
import type { ICategory } from 'components/models';
import { ref } from 'vue';

export const useCategoriesStore = defineStore('category', () => {
  const categories = ref<ICategory[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/categories');
      const data = await res.json();
      categories.value = data;
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: {
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка удаления');
      }

      categories.value = categories.value.filter((c) => c.id !== id);
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
    }
  };

  async function updateCategory(id: number, data: { name: string }) {
    await fetch(`http://localhost:3000/api/v1/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    await fetchCategories();
  }

  const createCategory = async (data: { name: string }) => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/categories/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка при добавлении категории');
      }

      await fetchCategories();
    } catch (error) {
      console.error('Ошибка при добавлении категории:', error);
    }
  };

  return {
    categories,
    fetchCategories,
    deleteCategory,
    updateCategory,
    createCategory,
  };
});
