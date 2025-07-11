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

const form = ref<Omit<ICategory, 'id'>>({
  name: '',
});

function onSubmit() {
  console.log('Onsubmit');
}

function onReset() {
  console.log('OnReset');
}
</script>

<style scoped></style>
