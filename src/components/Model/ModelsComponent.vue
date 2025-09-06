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
      <draggable
        :list="localModels"
        item-key="id"
        @end="onDragEnd"
        handle=".drag-handle"
      >
        <template #item="{ element: model, index }">
          <div
            class="row items-center q-py-md q-px-sm cursor-pointer cat-block"
            @click="$router.push(`/models/${model.id}`)"
          >
            <div class="drag-handle q-mr-sm" style="cursor: grab;">
              <q-icon name="drag_handle" size="sm" class="text-grey-6" />
            </div>

            <div class="text-grey-8 q-mr-sm">#{{ index + 1 }}</div>

            <div class="q-mr-md" style="width: 200px; height: 150px;">
              <img
                v-if="model.image_path"
                :src="model.image_path"
                class="full-width full-height"
                style="object-fit: cover; border-radius: 4px;"
              />
              <div
                v-else
                class="full-width full-height bg-grey-4 flex flex-center text-grey-6"
                style="border-radius: 4px;"
              >
                <q-icon name="image_not_supported" size="sm" />
              </div>
            </div>

            <div class="col q-px-md">
              <div class="text-weight-medium">{{ model.title }}</div>
              <div class="text-caption text-grey">Цена: {{ model.price }} ₽</div>
            </div>

            <div class="q-mr-md" @click.stop>
              <q-toggle
                :model-value="model.is_active"
                :label="model.is_active ? 'Активна' : 'Неактивна'"
                color="green"
                @update:model-value="toggleModelActive(model.id, $event)"
              />
            </div>

            <q-btn
              label="Удалить"
              color="red"
              @click.stop="confirmDelete(model.id)"
            />
          </div>
        </template>
      </draggable>

      <div v-if="localModels.length === 0" class="text-grey q-pa-md text-center">
        Модели не найдены
      </div>
    </div>

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Вы уверены, что хотите удалить модель?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn
            flat
            label="Удалить"
            color="negative"
            @click="onDelete"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useModelsStore } from 'stores/modelsStore';
import { useCategoriesStore } from 'stores/categoryStore';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import draggable from 'vuedraggable';

const $q = useQuasar();
const modelsStore = useModelsStore();
const categoriesStore = useCategoriesStore();

const { models } = storeToRefs(modelsStore);
const { categories } = storeToRefs(categoriesStore);

const selectedCategoryId = ref<number | null>(null);
const showDeleteConfirm = ref(false);
const deleteModelId = ref<number | null>(null);
const localModels = ref<any[]>([]);

onMounted(async () => {
  try {
    await categoriesStore.fetchCategories();
    await modelsStore.fetchModels();
    localModels.value = [...filteredModels.value];
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Ошибка при загрузке данных' });
  }
});

const categoriesOptions = computed(() =>
  categories.value.map(cat => ({ id: cat.id, name: cat.name }))
);

const filteredModels = computed(() => {
  let filtered = models.value;
  if (selectedCategoryId.value !== null) {
    filtered = filtered.filter(m => m.category_id === selectedCategoryId.value);
  }
  return filtered.sort((a, b) => a.position - b.position);
});

watch(filteredModels, (newValue) => {
  localModels.value = [...newValue];
}, { immediate: true });

async function onDragEnd(event: any) {
  if (event.oldIndex === event.newIndex) return;

  try {
    const movedItem = localModels.value[event.newIndex];

    const prevItem = localModels.value[event.newIndex - 1];
    const nextItem = localModels.value[event.newIndex + 1];

    let newPosition;

    if (!prevItem) {
      newPosition = nextItem.position - 1;
    } else if (!nextItem) {
      newPosition = prevItem.position + 1;
    } else {
      // где-то в середине
      newPosition = (prevItem.position + nextItem.position) / 2;
    }

    await modelsStore.updateModel(movedItem.id, { position: newPosition });

    $q.notify({ type: 'positive', message: 'Позиция модели обновлена' });

    await modelsStore.fetchModels();
  } catch (error) {
    console.error('Ошибка при обновлении позиции:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при обновлении позиции' });
    await modelsStore.fetchModels();
  }
}

function confirmDelete(id: number) {
  deleteModelId.value = id;
  showDeleteConfirm.value = true;
}

async function onDelete() {
  if (deleteModelId.value === null) return;
  try {
    await modelsStore.deleteModel(deleteModelId.value);
    $q.notify({ type: 'positive', message: 'Модель удалена' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка при удалении модели' });
    console.error(e);
  } finally {
    deleteModelId.value = null;
  }
}

async function toggleModelActive(modelId: number, isActive: boolean) {
  try {
    await modelsStore.updateModel(modelId, { is_active: isActive });
    $q.notify({
      type: 'positive',
      message: `Модель ${isActive ? 'активирована' : 'деактивирована'}`
    });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка при изменении статуса модели' });
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
.drag-handle:hover {
  color: #1976d2;
}
</style>
