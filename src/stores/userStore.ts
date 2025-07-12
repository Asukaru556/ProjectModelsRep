import { defineStore } from 'pinia';
import { ref } from 'vue';
interface IUser {
  userId: number,
  username: string,
  email: string,
  token: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null);

  const setUser = (newUser: IUser) => {
    user.value = newUser;
  };

  const clearUser = () => {
    user.value = null;
  };

  return { user, setUser, clearUser };
});
