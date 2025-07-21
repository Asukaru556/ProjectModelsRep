<template>
  <div class="row justify-between">
    <div class="text-h6">Редактирование категории</div>
    <q-btn icon="arrow_back" label="Назад" type="submit" color="primary" @click="$router.back()" />
  </div>

  <q-form v-if="form" @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mt-md">
    <q-input
      filled
      v-model="form.name"
      label="Название"
      hint="Название категории"
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
import type { ICategory } from 'components/models';
import { useCategoriesStore } from 'stores/categoryStore';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter  } from 'vue-router';

const form = ref<ICategory | undefined>(undefined);

const store = useCategoriesStore();
const { categories } = storeToRefs(store);
const route = useRoute();
const router = useRouter();

onMounted(() => {
  const category = categories.value.find((x) => x.id === Number(route.params.id));
  if (category) {
    form.value = { ...category };
  }
});

async function onSubmit() {
  if (!form.value) return;

  try {
    await store.updateCategory(form.value.id, { name: form.value.name });
    await router.push('/categories');
  } catch (error) {
    console.error('Ошибка при обновлении:', error);
  }
}

async function onDelete() {
  if (!form.value) return;

  try {
    await store.deleteCategory(form.value.id);
    await router.push('/categories');
  } catch (error) {
    console.error('Ошибка при удалении:', error);
  }
}

function onReset() {
  if (!form.value) return;

  const category = categories.value.find((x) => x.id === form.value?.id);
  if (category) {
    form.value.name = category.name;
  }
}
</script>

<style scoped></style>
