import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ModelFromAPI } from 'components/models'
import { modelApi } from 'src/api/modelApi'

export const useModelsStore = defineStore('models', () => {
  const models = ref<ModelFromAPI[]>([])

  const fetchModels = async () => {
    try {
      const data = await modelApi.getModels()
      models.value = data
    } catch (error) {
      console.error('Ошибка при загрузке моделей:', error)
    }
  }

  const fetchModel = async (id: number) => {
    try {
      return await modelApi.getModel(id)
    } catch (error) {
      console.error('Ошибка при загрузке модели:', error)
      return null
    }
  }

  const createModel = async (payload: Partial<ModelFromAPI>) => {
    try {
      await modelApi.createModelApi(payload)
      await fetchModels()
    } catch (error) {
      console.error('Ошибка при добавлении модели:', error)
    }
  }

  const updateModel = async (id: number, payload: Partial<ModelFromAPI>) => {
    try {
      await modelApi.updateModelApi(id, payload)
      await fetchModels()
    } catch (error) {
      console.error('Ошибка при обновлении модели:', error)
    }
  }

  const deleteModel = async (id: number) => {
    try {
      await modelApi.deleteModelApi(id)
      models.value = models.value.filter(m => m.id !== id)
    } catch (error) {
      console.error('Ошибка при удалении модели:', error)
    }
  }

  const toggleModelActive = async (id: number, isActive: boolean) => {
    try {
      await modelApi.toggleModelActiveApi(id, isActive)
      await fetchModels()
    } catch (error) {
      console.error('Ошибка при переключении активности модели:', error)
    }
  }

  const updateModelsPositions = async (modelsToUpdate: Array<{ id: number; position: number }>) => {
    try {
      await modelApi.updateModelsPositionsApi(modelsToUpdate)
      // локально обновляем порядок
      models.value = models.value.map(model => {
        const updated = modelsToUpdate.find(m => m.id === model.id)
        return updated ? { ...model, position: updated.position } : model
      })
    } catch (error) {
      console.error('Ошибка при обновлении позиций моделей:', error)
    }
  }

  const uploadFileModel = async (file: File): Promise<string> => {
    try {
      const response = await modelApi.uploadFileModelApi(file);
      return response.modelUrl;
    } catch (error) {
      console.error('Ошибка при загрузке модели:', error);
      throw error;
    }
  };

  const uploadImageModel = async (file: File): Promise<string> => {
    try {
      const response = await modelApi.uploadImageModelApi(file);
      return response.imageUrl;
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      throw error;
    }
  };

  return {
    models,
    fetchModels,
    fetchModel,
    createModel,
    updateModel,
    deleteModel,
    toggleModelActive,
    updateModelsPositions,
    uploadFileModel,
    uploadImageModel
  }
})
