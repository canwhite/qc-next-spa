import { create } from "zustand";
import { combine, persist, createJSONStorage } from "zustand/middleware";
import { Updater } from "../typing";
import { deepClone } from "./clone";
import { indexedDBStorage } from "./localStorage";


/**
create: 用于创建状态存储。
combine, persist, createJSONStorage: zustand 的中间件，用于组合状态和实现持久化。
Updater: 自定义类型，用于更新状态。
deepClone: 用于深度克隆状态对象。
indexedDBStorage: 自定义的 IndexedDB 存储实现。
 */

type SecondParam<T> = T extends (
  _f: infer _F,
  _s: infer S,
  ...args: infer _U
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any
  ? S
  : never;

type MakeUpdater<T> = {
  lastUpdateTime: number;
  _hasHydrated: boolean;

  markUpdate: () => void;
  update: Updater<T>;
  setHasHydrated: (state: boolean) => void;
};

type SetStoreState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
) => void;

/**
 * createPersistStore 函数用于创建一个持久化的状态存储。
 * 
 * @param state - 初始状态对象。
 * @param methods - 一个函数，用于定义状态存储的方法。该函数接收两个参数：
 *   - set: 用于更新状态的函数。
 *   - get: 用于获取当前状态的函数。
 * @param persistOptions - 持久化选项，用于配置持久化行为。
 * 
 * 该函数的主要功能是创建一个持久化的状态存储，并使用 IndexedDB 作为存储后端。
 * 它还提供了一些额外的功能，如标记更新时间和设置 hydration 状态。
 */


export function createPersistStore<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M,
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>,
) {
  persistOptions.storage = createJSONStorage(() => indexedDBStorage);
  const oldOonRehydrateStorage = persistOptions?.onRehydrateStorage;
  persistOptions.onRehydrateStorage = (state) => {
    oldOonRehydrateStorage?.(state);
    return () => state.setHasHydrated(true);
  };

  return create(
    persist(
      combine(
        {
          ...state,
          lastUpdateTime: 0,
          _hasHydrated: false,
        },
        (set, get) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...methods(set as any, get as any),

            markUpdate() {
              set({ lastUpdateTime: Date.now() } as Partial<
                T & M & MakeUpdater<T>
              >);
            },
            update(updater) {
              const state = deepClone(get());
              updater(state);
              set({
                ...state,
                lastUpdateTime: Date.now(),
              });
            },
            setHasHydrated: (state: boolean) => {
              set({ _hasHydrated: state } as Partial<T & M & MakeUpdater<T>>);
            },
          } as M & MakeUpdater<T>;
        },
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      persistOptions as any,
    ),
  );
}
