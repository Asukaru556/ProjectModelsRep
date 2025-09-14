import { api } from 'src/api/api'
import type { ModelFromAPI } from 'components/models'

const baseURL = '/models'

 function getModels() {
  return api.get<ModelFromAPI[]>(`${baseURL}`)
}

 function getModel(id: number) {
  return api.get<ModelFromAPI>(`${baseURL}/${id}`)
}

 function createModelApi(data: Partial<ModelFromAPI>) {
  return api.post<ModelFromAPI>(`${baseURL}`, data)
}

 function updateModelApi(id: number, data: Partial<ModelFromAPI>) {
  return api.put<ModelFromAPI>(`${baseURL}/${id}`, data)
}

 function deleteModelApi(id: number) {
  return api.delete<void>(`${baseURL}/${id}`)
}

 function toggleModelActiveApi(id: number, isActive: boolean) {
  return api.put<ModelFromAPI>(`${baseURL}/${id}`, { is_active: isActive })
}

 function updateModelsPositionsApi(models: Array<{ id: number; position: number }>) {
  return api.patch<void>(`${baseURL}/positions`, { models })
}

 async function uploadFileModelApi(file: File): Promise<{ modelUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<{ modelUrl: string }>('/upload/models', formData);
}

 async function uploadImageModelApi(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);
  return api.post<{ imageUrl: string }>('/upload/images', formData);
}

export const modelApi = {
  getModels,
  getModel,
  createModelApi,
  updateModelApi,
  deleteModelApi,
  toggleModelActiveApi,
  updateModelsPositionsApi,
  uploadFileModelApi,
  uploadImageModelApi,
}

