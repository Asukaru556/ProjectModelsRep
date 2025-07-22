<template>
  <q-card class="register-card q-pa-md">
    <q-card-section>
      <div class="text-h6">Register</div>
    </q-card-section>

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="form.email"
        label="Email"
        hint="Ваш email"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле является обязательным!',
          (val) =>
            (val && /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) || 'Введите корректный email!',
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="form.password"
        label="Password"
        hint="Придумайте пароль"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле является обязательным!',
          (val) => (val.length >= 3 && val.length <= 15) || 'От 3 до 15 символов',
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="form.confirmPassword"
        label="Repeat Password"
        hint="Повторите пароль"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле является обязательным!',
          (val) => val === form.password || 'Пароли не совпадают!',
        ]"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/api/api';
import { useUserStore } from 'stores/userStore';
import type { IRegisterForm } from 'components/models';

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();

interface RegisterResponse {
  token: string;
  userId: number;
  email: string;
}

const form = ref<IRegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
});

async function onSubmit() {
  try {
    const payload = {
      email: form.value.email,
      password: form.value.password,
    };

    const response = await api.post<RegisterResponse>('/auth/register', payload);

    api.setAuthToken(response.token);
    userStore.setUser({
      userId: response.userId,
      email: response.email,
      token: response.token,
    });

    $q.notify({
      type: 'positive',
      message: 'Регистрация успешна!',
    });

    await router.push('/');
  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Ошибка регистрации',
    });
  }
}

function onReset() {
  form.value = {
    email: '',
    password: '',
    confirmPassword: '',
  };
}
</script>

<style scoped>
.register-card {
  width: 360px;
}
</style>
