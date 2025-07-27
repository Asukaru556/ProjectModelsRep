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
    children: [{ path: '', component: () => import('pages/Category/CategoriesPage.vue') }],
  },

  {
    path: '/categories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Category/CategoriesPage.vue') },
      { path: 'add', component: () => import('pages/Category/NewCategoryPage.vue') },
      { path: ':id', component: () => import('pages/Category/CategoryPage.vue') },
    ],
  },

  {
    path: '/models',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Model/ModelsPage.vue') },
      { path: 'add', component: () => import('pages/Model/NewModelPage.vue') },
      { path: ':id', component: () => import('pages/Model/ModelPage.vue') },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/Auth/LoginPage.vue') }],
  },

  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/Auth/RegisterPage.vue') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
