<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Библиотека моделей</q-toolbar-title>

        <div v-if="!isAuthenticated">
          <q-btn to="/login" color="primary" icon="login" label="Войти"></q-btn>
          <q-btn to="/register" color="primary" icon="perm_identity" label="Регистрация"></q-btn>
        </div>
        <div v-else>
          <q-btn color="primary" icon="account_circle" :label="userEmail"></q-btn>
          <q-btn color="negative" icon="logout" label="Выйти" @click="logout"></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Меню</q-item-label>
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
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useUserStore } from 'stores/userStore';
import { api } from 'src/api/api';
import { Cookies } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const leftDrawerOpen = ref(false);

const isAuthenticated = computed(() => !!user.value?.token);
const userEmail = computed(() => user.value?.email || '');

export interface IApiUser  {
  id: number;
  username: string;
  email: string;
  token: string;
}

onMounted(async () => {
  const token = Cookies.get('login_token');
  if (!token) {
    await redirectToLogin();
    return;
  }

  try {
    const userData = await api.get<IApiUser>('/auth/user'); // Эндпоинт для получения данных о текущем пользователе
    console.log('UserData from API:', userData);

    userStore.setUser({
      userId: userData.id,
      username: userData.username,
      email: userData.email,
      token: token
    });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    await redirectToLogin();
  }
});

const redirectToLogin = async () => {
  userStore.clearUser();
  api.removeAuthToken();
  await router.push('/login');
  $q.notify({
    type: 'negative',
    message: 'Требуется авторизация'
  });
};

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

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}



async function logout() {
  try {
    userStore.clearUser();
    api.removeAuthToken();
    await router.push('/login');
    $q.notify({
      type: 'positive',
      message: 'Вы успешно вышли',
    });
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  }
}

</script>
