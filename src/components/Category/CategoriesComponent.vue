<template>
  <div class="row justify-between">
    <div class="text-h6">Категории</div>
    <q-btn @click="$router.push(`categories/add`)" color="primary">
      <q-icon  left size="3em" name="add_circle_outline" />
      <div>Создать новую категорию</div>
    </q-btn>
  </div>
  <div class="q-py-md">
    <div
      v-for="(category, index) in categories"
      :key="category.id"
      class="row items-center q-py-md q-px-sm cursor-pointer cat-block"
      @click="$router.push(`categories/${category.id}`)"
    >
      <div class="text-grey-8">#{{ index + 1 }}</div>
      <div class="col q-px-md">
        {{ category.name }}
      </div>
      <div>
        <q-btn
          @click.stop="onDelete(category.id)"
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
import { useCategoriesStore } from 'stores/categoryStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const store = useCategoriesStore()
const { categories } = storeToRefs(store)

onMounted(async () => {
  await store.fetchCategories()
})

async function onDelete(id: number) {
  await store.deleteCategory(id)
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
