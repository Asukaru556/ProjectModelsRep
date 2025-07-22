import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Cookies } from 'quasar';

export interface IUser {
  userId: number;
  email: string;
  token: string;
}

export const useUserStore = defineStore('user', () => {
  const getNumberFromCookies = (key: string): number | null => {
    const value = Cookies.get(key);
    return value ? Number(value) : null;
  };

  // Пытаемся получить данные из Cookies при инициализации
  const token = Cookies.get('login_token');
  const initialUser = token ? {
    token,
    userId: getNumberFromCookies('user_id') || 0,
    username: Cookies.get('username') || '',
    email: Cookies.get('user_email') || ''
  } : null;

  const user = ref<IUser | null>(initialUser);

  const setUser = (newUser: IUser) => {
    user.value = newUser;
    Cookies.set('user_email', newUser.email);
    Cookies.set('user_id', String(newUser.userId));
    Cookies.set('login_token', newUser.token);
  };

  const clearUser = () => {
    user.value = null;
    Cookies.remove('login_token');
    Cookies.remove('user_id');
    Cookies.remove('username');
    Cookies.remove('user_email');
  };

  return {
    user,
    setUser,
    clearUser
  };
});
