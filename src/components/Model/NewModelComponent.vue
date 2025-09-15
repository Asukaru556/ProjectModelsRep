  <template>
    <div>
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
            val => !!val || 'Поле обязательно!',
            val => (val && val.length < 256) || 'Не более 256 символов',
          ]"
        />

        <q-input
          filled
          type="textarea"
          v-model="form.description"
          label="Описание"
          hint="Краткое описание модели"
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
          :rules="[val => val !== null || 'Категория обязательна']"
        />

        <q-input
          filled
          v-model.number="form.position"
          type="number"
          label="Позиция"
          hint="Порядковый номер для сортировки"
          :rules="[
            val => val !== null && val !== undefined || 'Позиция обязательна',
            val => val >= 0 || 'Позиция должна быть неотрицательной',
          ]"
        />

        <q-file
          label="Загрузите картинку"
          filled
          v-model="form.tempImage"
          :rules="[() => !!form.image_path || 'Изображение обязательно']"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <div v-if="imagePreview" class="q-mt-md">
          <img :src="imagePreview" alt="Превью" style="max-width: 200px; border-radius: 8px;" />
        </div>

        <q-file
          label="Загрузите файл модели"
          filled
          v-model="form.tempModel"
          :rules="[() => !!form.model_path || 'Файл модели обязателен']"
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
          hint="Стоимость модели"
          :rules="[
            val => val === null || val === undefined || val >= 0 || 'Цена не может быть отрицательной'
          ]"
        />

        <q-input
          filled
          v-model="form.direct_purchase_url"
          label="Ссылка на магазин"
          hint="Прямая ссылка на покупку"
          :rules="[
            val => !val || /^https?:\/\/.+/.test(val) || 'Ссылка должна начинаться с http:// или https://'
          ]"
        />


        <q-input
          filled
          v-model="form.button_name"
          label="Название кнопки"
          hint="Текст на кнопке покупки"
          :rules="[
    val => !val || val.length < 50 || 'Не более 50 символов'
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
          <q-btn label="Сохранить" type="submit" color="primary" />
          <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, watch, onMounted, computed } from 'vue'
  import { useQuasar } from 'quasar'
  import { useRouter } from 'vue-router'

  import { useCategoriesStore } from 'stores/categoryStore'
  import { useModelsStore } from 'stores/modelsStore'
  import type { ICategory, ModelFromAPI, NewModel } from 'components/models'

  const categoriesStore = useCategoriesStore()
  const categoriesOptions = ref<ICategory[]>([])
  const modelsStore = useModelsStore()
  const $q = useQuasar()
  const router = useRouter()

  onMounted(async () => {
    await categoriesStore.fetchCategories()
    categoriesOptions.value = categoriesStore.categories.map(cat => ({ id: cat.id, name: cat.name }))
  })

  const imagePreview = computed(() => {
    if (form.value.tempImage instanceof File) {
      return URL.createObjectURL(form.value.tempImage)
    }
    return null
  })

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
    is_stock: false,
    position: 0,
    button_name: '',
    is_active: true,
  })

  watch(
    () => form.value.tempImage,
    async (newFile) => {
      if (newFile) {
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
    () => form.value.tempModel,
    async (newFile) => {
      if (newFile) {
        try {
          form.value.model_path = await modelsStore.uploadFileModel(newFile)
        } catch {
          form.value.tempModel = null
          $q.notify({ type: 'negative', message: 'Ошибка загрузки файла модели' })
        }
      }
    }
  )



  async function onSubmit() {
    try {
      if (!form.value.title?.trim()) {
        $q.notify({ color: 'negative', message: 'Название модели обязательно!' })
        return
      }
      if (!form.value.model_path) {
        $q.notify({ color: 'negative', message: 'Файл модели обязателен' })
        return
      }

      const payload: Partial<ModelFromAPI> = {
        title: form.value.title,
        description: form.value.description || '',
        image_path: form.value.image_path ?? undefined,
        model_path: form.value.model_path ?? '',
        price: Number(form.value.price),
        direct_purchase_url: form.value.direct_purchase_url || '',
        category_id: form.value.category_id ?? null,
        is_active: form.value.is_active ?? true,
        is_stock: form.value.is_stock ?? false,
        position: form.value.position ?? 0,
        button_name: form.value.button_name || '',
      }

      await modelsStore.createModel(payload)
      $q.notify({ color: 'positive', message: 'Модель успешно добавлена', icon: 'check' })
      await router.push('/models')
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Ошибка при добавлении модели: ' + (error instanceof Error ? error.message : ''),
        icon: 'report_problem',
      })
    }
  }

  function onReset() {
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
      is_stock: false,
      position: 0,
      button_name: '',
      is_active: true,
    }
  }
  </script>
