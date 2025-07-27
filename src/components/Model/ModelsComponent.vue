<template>
  <div>
    <div class="row justify-between q-mb-md">
      <div class="text-h6">Модели</div>
      <q-btn @click="$router.push('models/add')" color="primary">
        <q-icon left size="3em" name="add_circle_outline" />
        <div>Добавить модель</div>
      </q-btn>
    </div>

    <q-select
      filled
      v-model="selectedCategoryId"
      :options="categoriesOptions"
      option-label="name"
      option-value="id"
      label="Выберите категорию"
      clearable
      emit-value
      map-options
      class="q-mb-md"
    />

    <div class="q-py-md">
      <div
        v-for="(model, index) in filteredModels"
        :key="model.id"
        class="row items-center q-py-md q-px-sm cursor-pointer cat-block"
      >
        <div class="text-grey-8 q-mr-sm">#{{ index + 1 }}</div>

        <div @click="$router.push(`/models/${model.id}`)" class="col q-px-md">
          <div class="text-weight-medium">{{ model.title }}</div>
          <div class="text-caption text-grey">Цена: {{ model.price }} ₽</div>
        </div>

        <div>
          <q-btn
            @click.stop="onDelete(model.id)"
            unelevated
            round
            size="xs"
            color="negative"
            icon="close"
            aria-label="Удалить модель"
          />
        </div>
      </div>
      <div v-if="filteredModels.length === 0" class="text-grey q-pa-md text-center">
        Модели не найдены
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useModelsStore } from 'stores/modelsStore';
import { useCategoriesStore } from 'stores/categoryStore';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const modelsStore = useModelsStore();
const categoriesStore = useCategoriesStore();

const { models } = storeToRefs(modelsStore);
const { categories } = storeToRefs(categoriesStore);

const selectedCategoryId = ref<number | null>(null);

onMounted(async () => {
  try {
    await categoriesStore.fetchCategories();
    await modelsStore.fetchModels();
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Ошибка при загрузке данных' });
  }
});

const categoriesOptions = computed(() =>
  categories.value.map(cat => ({ id: cat.id, name: cat.name }))
);

const filteredModels = computed(() => {
  if (selectedCategoryId.value === null) {
    return models.value;
  }
  return models.value.filter(m => m.category_id === selectedCategoryId.value);
});

async function onDelete(id: number) {
  try {
    await modelsStore.deleteModel(id);
    $q.notify({ type: 'positive', message: 'Модель удалена' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка при удалении модели' });
    console.error(e);
  }
}
</script>

<style scoped>
.cat-block {
  border-bottom: 1px solid #ccc;
  transition: background 0.2s ease-in-out;
}
.cat-block:hover {
  background: #efeded;
}
</style>
