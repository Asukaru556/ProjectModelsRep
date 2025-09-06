<template>
  <div class="row justify-between">
    <div class="text-h6">Редактирование модели</div>
    <q-btn icon="arrow_back" label="Назад" color="primary" @click="$router.back()" />
  </div>

  <q-form v-if="form" @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md q-mt-md">
    <q-input
      filled
      v-model="form.title"
      label="Название"
      hint="Название модели"
      :rules="[
        (val) => (val && val.length > 0) || 'Поле является обязательным!',
        (val) => (val && val.length < 256) || 'Должно быть не больше 256 символов!',
      ]"
    />

    <q-input
      filled
      v-model="form.description"
      label="Описание"
      type="textarea"
      hint="Описание модели"
    />

    <q-select
      filled
      v-model="form.category_id"
      :options="categoriesOptions"
      label="Категория"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      clearable
      hint="Выберите категорию модели"
    />

    <q-input
      filled
      v-model.number="form.position"
      type="number"
      label="Позиция"
      hint="Порядковый номер для сортировки"
      :rules="[
        val => val >= 0 || 'Позиция должна быть неотрицательной',
      ]"
    />

    <img v-if="imagePreviewUrl" :src="imagePreviewUrl" width="200" />

    <q-file
      filled
      v-model="form.tempImage"
      :label="imageLabel"
      accept="image/*"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <q-file
      filled
      v-model="form.tempModel"
      :label="modelLabel"
      accept=".glb,.obj,.fbx"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <q-input
      filled
      v-model.number="form.price"
      type="number"
      label="Цена"
      hint="Цена модели"
      :rules="[(val) => val === null || val >= 0 || 'Цена должна быть неотрицательной!']"
    />

    <q-input
      filled
      v-model="form.direct_purchase_url"
      label="Ссылка на магазин"
      hint="URL"
      type="url"
    />

    <q-checkbox
      v-model="form.is_stock"
      label="Стоковая модель"
      :true-value="true"
      :false-value="false"
    />

    <div>
      <q-btn label="Обновить" type="submit" color="primary" />
      <q-btn label="Удалить" color="red" class="q-ml-sm" @click="showDeleteConfirm = true" />
      <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Вы уверены, что хотите удалить модель?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Удалить" color="negative" @click="onDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>

  <div v-else>Модель не найдена</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { NewModel, ModelFromAPI } from 'components/models';
import { useModelsStore } from 'stores/modelsStore.js';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import type {ICategory} from 'components/models';
import { useCategoriesStore } from 'stores/categoryStore';

const categoriesStore = useCategoriesStore();
const categoriesOptions = ref<ICategory[]>([]);

const FileConstructor = window.File;
const isFile = (val: unknown): val is File => val instanceof FileConstructor;

const form = ref<NewModel | undefined>(undefined);
const imagePreviewUrl = ref<string | null>(null);
const showDeleteConfirm = ref(false)

const modelsStore = useModelsStore();
const { models } = storeToRefs(modelsStore);
const route = useRoute();
const router = useRouter();

const imageLabel = ref('Выберите изображение');
const modelLabel = ref('Выберите модель');

onMounted(async () => {
  await categoriesStore.fetchCategories();
  categoriesOptions.value = categoriesStore.categories.map(cat => ({ id: cat.id, name: cat.name }));
});

onMounted(async () => {
  await modelsStore.fetchModels();
  const modelFromStore = models.value.find(x => x.id === Number(route.params.id));
  if (modelFromStore) {
    form.value = {
      ...modelFromStore,
      image_path: modelFromStore.image_path ?? null,
      model_path: modelFromStore.model_path ?? null,
      tempImage: null,
      tempModel: null,
      price: modelFromStore.price,
      is_stock: modelFromStore.is_stock || false,
      position: modelFromStore.position || 0,
    };
    imagePreviewUrl.value = modelFromStore.image_path ?? null;
  }
});

watch(
  () => form.value?.tempImage,
  (newFile, oldFile) => {
    if (oldFile instanceof File && imagePreviewUrl.value) {
      URL.revokeObjectURL(imagePreviewUrl.value);
    }
    if (newFile instanceof File) {
      imagePreviewUrl.value = URL.createObjectURL(newFile);
    } else if (form.value?.image_path) {
      imagePreviewUrl.value = form.value.image_path;
    } else {
      imagePreviewUrl.value = null;
    }
    updateLabels();
  }
);

watch(
  () => form.value?.tempModel,
  () => {
    updateLabels();
  }
);

function updateLabels() {
  if (form.value) {
    imageLabel.value = form.value.tempImage && isFile(form.value.tempImage)
      ? form.value.tempImage.name
      : form.value.image_path || 'Выберите изображение';

    modelLabel.value = form.value.tempModel && isFile(form.value.tempModel)
      ? form.value.tempModel.name
      : form.value.model_path || 'Выберите модель';
  }
}

async function onSubmit() {
  if (!form.value || form.value.id === undefined) return;

  const updateData: Partial<ModelFromAPI> = {
    title: form.value.title,
    description: form.value.description,
    direct_purchase_url: form.value.direct_purchase_url,
    is_stock: form.value.is_stock,
    position: form.value.position,
  };

  if (form.value.price !== null && form.value.price !== undefined) {
    updateData.price = form.value.price;
  }

  if (form.value.category_id !== undefined) {
    updateData.category_id = form.value.category_id;
  }

  updateData.image_path = form.value.tempImage && isFile(form.value.tempImage)
    ? form.value.tempImage.name
    : form.value.image_path ?? undefined;

  updateData.model_path = form.value.tempModel && isFile(form.value.tempModel)
    ? form.value.tempModel.name
    : form.value.model_path ?? undefined;

  try {
    await modelsStore.updateModel(form.value.id, updateData);
    router.back()
  } catch (e) {
    console.error(e);
  }
}

async function onDelete() {
  if (!form.value || form.value.id === undefined) return;

  try {
    await modelsStore.deleteModel(form.value.id);
    router.back();
  } catch (e) {
    console.error(e);
  }
}

function onReset() {
  if (!form.value) return;
  form.value.title = '';
  form.value.description = '';
  form.value.image_path = null;
  form.value.model_path = null;
  form.value.tempImage = null;
  form.value.tempModel = null;
  form.value.price = null;
  form.value.direct_purchase_url = '';
  form.value.is_stock = false;
  imagePreviewUrl.value = null;
  updateLabels();
}
</script>

<style scoped></style>
