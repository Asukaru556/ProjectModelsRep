<template>
  <div>
    <div class="row justify-between">
      <div class="text-h6">Редактирование модели</div>
      <q-btn icon="arrow_back" label="Назад" color="primary" @click="$router.back()" />
    </div>

    <q-form
      v-if="form"
      @submit.prevent="onSubmit"
      @reset="onReset"
      class="q-gutter-md q-mt-md"
    >
      <q-input
        filled
        v-model="form.title"
        label="Название"
        hint="Название модели"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле обязательно!',
          (val) => (val && val.length < 256) || 'Не более 256 символов',
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

      <div v-if="imagePreview" class="q-mt-md">
        <img :src="imagePreview" alt="Превью" style="max-width: 200px; border-radius: 8px;" />
      </div>

      <q-file
        filled
        v-model="form.tempImage"
        label="Загрузите картинку"
        accept="image/*"
        :rules="imageRequiredRule"
        :display-value="form.image_path ? getFileName(form.image_path) : ''"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-file
        filled
        v-model="form.tempModel"
        label="Загрузите модель"
        accept=".glb,.obj,.fbx"
        :rules="modelRequiredRule"
        :display-value="form.model_path ? getFileName(form.model_path) : ''"
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

      <q-input
        filled
        v-model="form.button_name"
        label="Название кнопки"
        hint="Текст на кнопке"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле обязательно!',
          (val) => (val && val.length < 50) || 'Не более 50 символов',
        ]"
      />

      <q-checkbox
        v-model="form.is_stock"
        label="Стоковая модель"
        :true-value="true"
        :false-value="false"
      />

      <q-toggle
        v-model="form.is_active"
        label="Активная модель"
        :true-value="true"
        :false-value="false"
        color="green"
      />

      <div>
        <q-btn label="Обновить" type="submit" color="primary" />
        <q-btn label="Удалить" color="red" class="q-ml-sm" @click="showDeleteConfirm = true" />
        <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
        <q-btn :label="form?.button_name || 'Ваша кнопка'" color="primary" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useModelsStore } from 'stores/modelsStore'
import { useCategoriesStore } from 'stores/categoryStore'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { NewModel, ModelFromAPI, ICategory } from 'components/models'

const $q = useQuasar()
const categoriesStore = useCategoriesStore()
const categoriesOptions = ref<ICategory[]>([])

const modelsStore = useModelsStore()
const { models } = storeToRefs(modelsStore)
const route = useRoute()
const router = useRouter()

const form = ref<NewModel | undefined>(undefined)
const showDeleteConfirm = ref(false)


const imageRequiredRule = computed(() => [
  () => !!form.value?.image_path || 'Изображение обязательно'
])

const modelRequiredRule = computed(() => [
  () => !!form.value?.model_path || 'Файл модели обязателен'
])

onMounted(async () => {
  await categoriesStore.fetchCategories()
  categoriesOptions.value = categoriesStore.categories.map(cat => ({
    id: cat.id,
    name: cat.name
  }))
})

onMounted(async () => {
  await modelsStore.fetchModels()
  const modelFromStore = models.value.find(x => x.id === Number(route.params.id))
  if (modelFromStore) {
    form.value = {
      ...modelFromStore,
      image_path: modelFromStore.image_path ?? null,
      model_path: modelFromStore.model_path ?? null,
      tempImage: null,
      tempModel: null,
      price: modelFromStore.price,
      is_active: modelFromStore.is_active !== undefined ? modelFromStore.is_active : true,
      is_stock: modelFromStore.is_stock || false,
      position: modelFromStore.position || 0,
      button_name: modelFromStore.button_name || 'Ваша кнопка',
    }
  }
})

function getFileName(path: string): string {
  return path.split('/').pop() || path
}

const imagePreview = computed(() => {
  if (form.value?.tempImage instanceof File) {
    return URL.createObjectURL(form.value.tempImage)
  }
  return form.value?.image_path ?? null
})

watch(
  () => form.value?.tempImage,
  async (newFile) => {
    if (newFile instanceof File && form.value) {
      try {
        form.value.image_path = await modelsStore.uploadImageModel(newFile)
      } catch {
        form.value.tempImage = null
        $q.notify({ type: 'negative', message: 'Ошибка загрузки изображения' })
      }
    }
  }
)

watch(
  () => form.value?.tempModel,
  async (newFile) => {
    if (newFile instanceof File && form.value) {
      try {
        form.value.model_path = await modelsStore.uploadFileModel(newFile)
      } catch {
        form.value.tempModel = null
        $q.notify({ type: 'negative', message: 'Ошибка загрузки модели' })
      }
    }
  }
)

async function onSubmit() {
  if (!form.value || form.value.id === undefined) return

  const updateData: Partial<ModelFromAPI> = {
    title: form.value.title,
    direct_purchase_url: form.value.direct_purchase_url,
    is_stock: form.value.is_stock,
    position: form.value.position,
    button_name: form.value.button_name,
    description: form.value.description ?? '',
    price: form.value.price ?? 0,
    category_id: form.value.category_id ?? null,
    is_active: form.value.is_active ?? true,
    image_path: form.value.image_path ?? undefined,
    model_path: form.value.model_path ?? undefined,
  }

  try {
    await modelsStore.updateModel(form.value.id, updateData)
    $q.notify({ type: 'positive', message: 'Модель обновлена' })
    router.back()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Ошибка при обновлении модели' })
  }
}

async function onDelete() {
  if (!form.value || form.value.id === undefined) return
  try {
    await modelsStore.deleteModel(form.value.id)
    router.back()
  } catch (e) {
    console.error(e)
  }
}

function onReset() {
  if (!form.value) return
  form.value.title = ''
  form.value.description = ''
  form.value.image_path = null
  form.value.model_path = null
  form.value.tempImage = null
  form.value.tempModel = null
  form.value.price = null
  form.value.direct_purchase_url = ''
  form.value.is_active = true
  form.value.is_stock = false
  form.value.button_name = 'Ваша кнопка'
}
</script>
