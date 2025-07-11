<template>
  <div class="row justify-between">
    <div class="text-h6">Категории</div>
    <q-btn color="primary">
      <q-icon @click="$router.push(`categories/add`)" left size="3em" name="add_circle_outline" />
      <div>Создать новую категорию</div>
    </q-btn>
  </div>
  <div class="q-py-md">
    <div
      v-for="category in categories"
      :key="category.id"
      class="row items-center q-py-md q-px-sm cursor-pointer cat-block"
    >
      <div class="text-grey-8">#{{ category.id }}</div>
      <div @click="$router.push(`categories/${category.id}`)" class="col q-px-md">
        {{ category.name }}
      </div>
      <div>
        <q-btn
          @click="onDelete(category.id)"
          unelevated
          round
          size="xs"
          color="dark"
          icon="close"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from 'stores/categoryStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const { categories } = storeToRefs(useCategoriesStore());

onMounted(async () => {
  await getCategories();
});
async function getCategories() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/categories');

    const data = await response.json();
    categories.value = data;
  } catch (error) {
    console.log(error);
  }
}

function onDelete(id: number) {
  console.log('Delete', id);
}
</script>

<style scoped>
.cat-block {
  border-bottom: 1px #ccc solid;
}
.cat-block:hover {
  background: #efeded;
}
</style>
