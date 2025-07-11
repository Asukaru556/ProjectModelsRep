import { defineStore } from 'pinia';
import type { ICategory } from 'components/models';
import { ref } from 'vue';
import type { Ref } from 'vue';

export const useCategoriesStore = defineStore('category', () => {
  const categories: Ref<ICategory[]> = ref([
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

  return { categories };
});
