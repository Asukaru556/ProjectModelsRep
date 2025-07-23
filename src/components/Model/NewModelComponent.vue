<template>
  <div class="row justify-between">
    <div class="text-h6">Добавление модели</div>
    <q-btn icon="arrow_back" label="Назад" color="primary" @click="$router.back()" />
  </div>

  <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md q-mt-md">
    <q-input
      filled
      v-model="form.title"
      label="Название"
      hint="Название модели"
      :rules="[
        val => (val && val.length > 0) || 'Поле обязательно!',
        val => (val && val.length < 256) || 'Не более 256 символов',
      ]"
    />

    <q-input
      filled
      type="textarea"
      v-model="form.description"
      label="Описание"
      hint="Краткое описание модели"
      :rules="[
        val => (val && val.length > 0) || 'Поле обязательно!',
        val => (val && val.length < 1000) || 'Не более 1000 символов',
      ]"
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

    <img width="200" v-if="imagePreviewUrl" :src="imagePreviewUrl" class="q-mb-sm" />
    <q-file label="Загрузите картинку" filled v-model="form.tempImage">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <q-file label="Загрузите файл модели" filled v-model="form.tempModel">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <q-input
      filled
      v-model.number="form.price"
      type="number"
      label="Цена"
      hint="Стоимость модели"
      :rules="[
        val => val !== null && val !== undefined || 'Поле обязательно!',
        val => val >= 0 || 'Цена не может быть отрицательной',
      ]"
    />

    <q-input
      filled
      v-model="form.direct_purchase_url"
      label="Ссылка на магазин"
      hint="Прямая ссылка на покупку"
      :rules="[
        val => !val || /^https?:\/\/.+/.test(val) || 'Введите корректную ссылку (http/https)',
      ]"
    />

    <div>
      <q-btn label="Сохранить" type="submit" color="primary" />
      <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/api/api';
import { useRouter } from 'vue-router';
import type { NewModel} from 'components/models';
import type {ICategory} from 'components/models';
import { useCategoriesStore } from 'stores/categoryStore';

const categoriesStore = useCategoriesStore();
const categoriesOptions = ref<ICategory[]>([]);

const $q = useQuasar();
const router = useRouter();

onMounted(async () => {
  await categoriesStore.fetchCategories();
  categoriesOptions.value = categoriesStore.categories.map(cat => ({ id: cat.id, name: cat.name }));
});

const form = ref<NewModel>({
  title: '',
  description: '',
  image_path: null,
  model_path: null,
  price: null,
  direct_purchase_url: '',
  category_id: null,
  tempImage: null,
  tempModel: null,
});

const imagePreviewUrl = ref<string | null>(null);

watch(
  () => form.value.tempImage,
  (newFile) => {
    if (imagePreviewUrl.value) {
      URL.revokeObjectURL(imagePreviewUrl.value);
    }
    imagePreviewUrl.value = newFile ? URL.createObjectURL(newFile) : null;
  }
);

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post<{ imageUrl: string }>('/upload/images', formData);
  return response.imageUrl;
}

async function uploadModel(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('model', file);

  const response = await api.post<{ modelUrl: string }>('/upload/models', formData);
  return response.modelUrl;
}

watch(
  () => form.value.tempImage,
  async (newFile) => {
    if (newFile) {
      try {
        form.value.image_path = await uploadImage(newFile);
      } catch {
        form.value.tempImage = null;
        $q.notify({ type: 'negative', message: 'Ошибка загрузки изображения' });
      }
    }
  }
);

watch(
  () => form.value.tempModel,
  async (newFile) => {
    if (newFile) {
      try {
        form.value.model_path = await uploadModel(newFile);
      } catch {
        form.value.tempModel = null;
        $q.notify({ type: 'negative', message: 'Ошибка загрузки файла модели' });
      }
    }
  }
);

async function onSubmit() {
  try {
    if (!form.value.title?.trim()) {
      $q.notify({ color: 'negative', message: 'Название модели обязательно!' });
      return;
    }
    if (!form.value.model_path) {
      $q.notify({ color: 'negative', message: 'Файл модели обязателен' });
      return;
    }

    const payload = {
      title: form.value.title,
      description: form.value.description,
      image_path: form.value.image_path ?? '',
      model_path: form.value.model_path ?? '',
      price: form.value.price ?? 0,
      direct_purchase_url: form.value.direct_purchase_url ?? '',
      category_id: form.value.category_id,
    };

    await api.post('/models', payload);

    $q.notify({ color: 'positive', message: 'Модель успешно добавлена', icon: 'check' });

    await router.push('/models');
  } catch (error) {
    console.error('Ошибка добавления модели:', error);
    $q.notify({ color: 'negative', message: 'Ошибка при добавлении модели: ' + (error as Error).message, icon: 'report_problem' });
  }
}

function onReset() {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = null;
  }
  form.value = {
    title: '',
    description: '',
    image_path: null,
    model_path: null,
    price: null,
    direct_purchase_url: '',
    category_id: null,
    tempImage: null,
    tempModel: null,
  };
}
</script>

<style scoped></style>
