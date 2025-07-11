import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/categories',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CategoriesPage.vue') }],
  },

  {
    path: '/categories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CategoriesPage.vue') },
      { path: 'add', component: () => import('pages/NewCategoryPage.vue') },
      { path: ':id', component: () => import('pages/CategoryPage.vue') },
    ],
  },

  {
    path: '/models',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ModelsPage.vue') },
      { path: 'add', component: () => import('pages/NewModelPage.vue') },
      { path: ':id', component: () => import('pages/ModelPage.vue') },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
