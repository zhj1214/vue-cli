import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
// import { STORAGE, MUTATIONS_TYPE } from '../../../public/constant';

// 使用composition API模式定义store
export const useUserStore = defineStore('useUserStore', () => {
  const userInfo = reactive({});
  const isLogin = ref(false);

  const setLoginStatus = (val: boolean)=>{
    isLogin.value = val
  }

  return { userInfo, isLogin, setLoginStatus };
});
