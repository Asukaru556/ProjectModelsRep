import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ModelFromAPI } from 'components/models';



export const useModelsStore = defineStore('model', () => {
  const models = ref<ModelFromAPI[]>([]);

  const fetchModels = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/models/');
      const data = await res.json();
      models.value = data;
    } catch (error) {
      console.error('Ошибка при загрузке моделей:', error);
    }
  };

  const deleteModel = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/models/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка удаления модели');
      }

      models.value = models.value.filter((m) => m.id !== id);
    } catch (error) {
      console.error('Ошибка при удалении модели:', error);
    }
  };

  const updateModel = async (id: number, data: Partial<ModelFromAPI>) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/models/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка при обновлении модели');
      }

      await fetchModels();
    } catch (error) {
      console.error('Ошибка при обновлении модели:', error);
    }
  };

  const createModel = async (data: Partial<ModelFromAPI>) => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/models/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка при добавлении модели');
      }

      await fetchModels();
    } catch (error) {
      console.error('Ошибка при добавлении модели:', error);
    }
  };

  return {
    models,
    fetchModels,
    deleteModel,
    updateModel,
    createModel,
  };
});
