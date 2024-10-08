// store.ts
import { configureStore,combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { authReducer } from './reducers/authReducer';
import { articleReducer } from './reducers/articleReducer';

const persistConfig = {
    key: 'root',        
    version: 1,       
    storage,            
  };

  const rootReducer = combineReducers({
    auth: authReducer,
    article:articleReducer
  });
  const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer:persistedReducer
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
