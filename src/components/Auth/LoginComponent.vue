<template>
  <q-card class="login-card q-pa-md">
    <q-card-section>
      <div class="text-h6">Login</div>
    </q-card-section>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="form.email"
        label="Email"
        hint="Name and surname"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле является обязательным!',
          (val) =>
          (val && /^[\w.%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(val)) || 'Должен быть email!',
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="form.password"
        label="Password"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле является обязательным!',
          (val) =>
            (val && val.length >= 3 && val.length <= 15) || 'Не менее 3 и не более 15 символов',
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
import {api} from 'src/api/api'
import type { ILoginForm } from 'components/models';
import { useUserStore } from "stores/userStore";
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();

interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
}

const form = ref<ILoginForm>({
  email: '',
  password: '',
});
async function onSubmit() {
  try {
    const response: LoginResponse = await api.post('/auth/login', {
      email: form.value.email,
      password: form.value.password,
    });
    console.log('Login response:', response);

    api.setAuthToken(response.token);

    userStore.setUser({
      userId: response.userId,
      email: response.email,
      token: response.token,
    });

    $q.notify({
      type: 'positive',
      message: 'Авторизация успешна!',
    });

    await router.push('/models');
  } catch (error: unknown) {
    console.error('Ошибка авторизации:', error);
    let errorMessage = 'Ошибка авторизации. Попробуйте снова.';

    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
    });
  }
}

function onReset() {
  form.value = {
    email: '',
    password: '',
  };
  console.log('Submit', form);
}
</script>

<style scoped>
.login-card {
  width: 360px;
}
</style>
