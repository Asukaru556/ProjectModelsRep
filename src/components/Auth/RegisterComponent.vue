<template>
  <q-card class="register-card q-pa-md qcard">
    <q-card-section>
      <div class="text-h6">Register</div>
    </q-card-section>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="form.email"
        label="Email"
        hint="Your email"
        color="brown-5"
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
        hint="Create password"
        color="brown-5"
        :rules="[
          (val) => (val && val.length > 0) || 'Поле является обязательным!',
          (val) =>
            (val && val.length >= 3 && val.length <= 15) || 'Не менее 3 и не более 15 символов',
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="form.confirmPassword"
        label="Password"
        hint="Repeat password"
        color="brown-5"
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
import type { IRegisterForm } from 'components/models';

const form = ref<IRegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
});

function onSubmit() {
  console.log('Submit', form);
}

function onReset() {
  form.value = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  console.log('Reset', form);
}
</script>

<style scoped>
.register-card {
  width: 360px;
}
</style>
