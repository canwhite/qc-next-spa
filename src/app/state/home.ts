/* eslint-disable @typescript-eslint/no-unused-vars */
import { createPersistStore } from "@/app/utils/store";
import { StoreKey } from "../constant";

type HomeState = {
  queries:string[],
  results:string[]
};

export const DEFAULT_HOME_STATE = {
    queries:[],
    results:[]
} as HomeState;

const useHomeStore = createPersistStore(
  { ...DEFAULT_HOME_STATE },
  (set, get) => ({

        getQueries(){
            return get().queries;
        },
        setQueries(queries:string[]){
            set((state)=>({...state,queries}));
        },
        getResults(){
            return get().results;
        },
        setResults(results:string[]){
            set((state)=>({...state,results}));
        }

  }),
  {
    name: StoreKey.Home,
    version: 1,
    
    migrate(state, version) {
      /* 
        const newState = JSON.parse(JSON.stringify(state)) as MaskState;
    
        // migrate mask id to nanoid
        if (version < 3) {
            Object.values(newState.masks).forEach((m) => (m.id = nanoid()));
        }
    
        if (version < 3.1) {
            const updatedMasks: Record<string, Mask> = {};
            Object.values(newState.masks).forEach((m) => {
            updatedMasks[m.id] = m;
            });
            newState.masks = updatedMasks;
        }
    
        return newState as any;

        */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return state as any;
    },

    onRehydrateStorage(state) {
      //init，一些初始化操作
    },
  },
);

export default useHomeStore;
