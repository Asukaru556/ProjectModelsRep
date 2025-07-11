<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Библиотека моделей </q-toolbar-title>

        <div>
          <q-btn to="/login" color="primary" icon="login" label="Войти"> </q-btn>
          <q-btn to="/register" color="primary" icon="perm_identity" label="Регистрация"> </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Меню </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-lg">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.black {
  background: #121212;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Категории',
    caption: 'Категории моделей',
    icon: 'topic',
    link: '/categories',
  },
  {
    title: 'Модели',
    caption: 'Наши модели',
    icon: 'view_in_ar',
    link: '/models',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
