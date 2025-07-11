<template>
  <div class="row justify-between">
    <div class="text-h6">Редактирование модели</div>
    <q-btn icon="arrow_back" label="Назад" type="submit" color="primary" @click="$router.back()" />
  </div>

  <q-form v-if="form" @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mt-md">
    <q-input
      filled
      v-model="form.name"
      label="Название"
      hint="Название модели"
      :rules="[
        (val) => (val && val.length > 0) || 'Поле являетсяся обязательным!',
        (val) => (val && val.length < 256) || 'Должно быть не больше 256 символов!',
      ]"
    />

    <div>
      <q-btn label="Обновить" type="submit" color="primary" />
      <q-btn label="Удалить" color="red" class="q-ml-sm" @click="onDelete" />
      <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
  <div v-else>Данная категория не найдена</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { IModel } from 'components/models';
import { useModelsStore } from 'stores/modelsStore.js';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const form = ref<IModel | undefined>(undefined);

const { models } = storeToRefs(useModelsStore());
const route = useRoute();
onMounted(() => {
  form.value = models.value.find((x) => x.id === Number(route.params.id));
});

function onSubmit() {
  console.log('Onsubmit');
}

function onDelete() {
  console.log('onDelete');
}

function onReset() {
  console.log('OnReset');
}
</script>

<style scoped></style>
