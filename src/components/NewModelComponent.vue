<template>
  <div class="row justify-between">
    <div class="text-h6">Добавление модели</div>
    <q-btn icon="arrow_back" label="Назад" type="submit" color="primary" @click="$router.back()" />
  </div>

  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mt-md">
    <q-input
      filled
      v-model="form.name"
      label="Название"
      hint="Название модели"
      :rules="[
        (val) => (val && val.length > 0) || 'Поле является обязательным!',
        (val) => (val && val.length < 256) || 'Должно быть не больше 256 символов!',
      ]"
    />

    <img width="200" v-if="imagePreviewUrl" :src="imagePreviewUrl" />
    <q-file label="Загрузите картинку" filled v-model="form.image">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <q-file label="Загрузите модель" filled v-model="form.model">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <div>
      <q-btn label="Сохранить" type="submit" color="primary" />
      <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { IModel } from 'components/models';

const form = ref<Omit<IModel, 'id'>>({
  name: '',
  description: '',
  image: null,
  model: null,
});

const imagePreviewUrl = ref<string | null>(null);

watch(
  () => form.value.image,
  (newFile, oldFile) => {
    if (oldFile && imagePreviewUrl.value) {
      URL.revokeObjectURL(imagePreviewUrl.value);
      imagePreviewUrl.value = null;
    }
    if (newFile) {
      imagePreviewUrl.value = URL.createObjectURL(newFile);
    }
  },
);

function onSubmit() {
  console.log('Onsubmit', form.value);
}

function onReset() {
  form.value = {
    name: '',
    description: '',
    image: null,
    model: null,
  };
  console.log('OnReset');
}
</script>

<style scoped></style>
