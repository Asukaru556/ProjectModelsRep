import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { IModel } from 'components/models';

export const useModelsStore = defineStore('model', () => {
  const models: Ref<IModel[]> = ref([
    {
      id: 1,
      name: 'Первая модель',
      description: 'Описание первой модели',
    },
    {
      id: 2,
      name: 'Вторая модель',
      description: 'Описание второй модели',
    },
    {
      id: 3,
      name: 'Третья модель',
      description: 'Описание третьей модели',
    },
  ]);

  return { models };
});
