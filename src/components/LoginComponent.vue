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
          //(val) =>
          // (val && /^[\w.%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(val)) || 'Должен быть email!',
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
import type { ILoginForm } from 'components/models';

const form = ref<ILoginForm>({
  email: '',
  password: '',
});
async function onSubmit() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'post', // можно не указывать (по умолчанию GET)
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
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
