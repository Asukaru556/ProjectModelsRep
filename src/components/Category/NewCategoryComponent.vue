<template>
  <div class="row justify-between">
    <div class="text-h6">Добавление категории</div>
    <q-btn icon="arrow_back" label="Назад" type="submit" color="primary" @click="$router.back()" />
  </div>

  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mt-md">
    <q-input
      filled
      v-model="form.name"
      label="Название"
      hint="Название категории"
      :rules="[
        (val) => (val && val.length > 0) || 'Поле является обязательным!',
        (val) => (val && val.length < 256) || 'Должно быть не больше 256 символов!',
      ]"
    />

    <div>
      <q-btn label="Сохранить" type="submit" color="primary" />
      <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ICategory } from 'components/models';
import { useRouter } from 'vue-router';
import {createCategoryApi} from "src/api/categoryApi";

const router = useRouter();
const form = ref<Omit<ICategory, 'id'>>({
  name: '',
});

async function onSubmit() {
  try {
    await createCategoryApi({ name: form.value.name })
    await router.push('/categories');
  } catch (error) {
    console.error('Ошибка при сохранении категории:', error)
  }
}

function onReset() {
  form.value = {
    name: '',
  };
}
</script>

<style scoped></style>
