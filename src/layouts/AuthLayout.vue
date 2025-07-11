<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white row justify-between items-center">
      <div>
        <q-toolbar>
          <q-toolbar-title>
            <q-btn to="/" color="primary" label="">
              <q-avatar>
                <img :src="logo" />
              </q-avatar>
            </q-btn>
            Авторизация
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div>
        <q-btn to="/login" color="primary" icon="login" label="Войти"> </q-btn>
        <q-btn to="/register" color="primary" icon="perm_identity" label="Регистрация"> </q-btn>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import logo from '../../public/icons/logo.png';
</script>
