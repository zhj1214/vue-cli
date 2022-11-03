import { useUserStore } from './modules/user';
import { useGlobStore } from './modules/glob';

// store智能提示
export interface AppStore {
  user: ReturnType<typeof useUserStore>;
  useGlobStore: ReturnType<typeof useGlobStore>;
}

const appStore: AppStore = {} as AppStore;

/**
 * 注册app状态库
 */
export const registerStore = () => {
  appStore.user = useUserStore();
  appStore.useGlobStore = useGlobStore();
  // 重写reset方法
  initResetFun(appStore);
};

/**
 * 重构$reset()
 * @desc 因为setup模式编程不支持reset方法，这里要手动重构
 * @param appStore
 */
export const initResetFun = (appStore: AppStore) => {
  Object.values(appStore).forEach(item => {
    const initState = {} as Record<string, any>;
    Object.entries(item.$state).forEach(item => {
      initState[item[0]] = item[1];
    });
    item.reset = () => {
      Object.keys(item.$state).forEach(state => {
        item.$state[state] = initState[state];
      });
    };
  });
};

export default appStore;
