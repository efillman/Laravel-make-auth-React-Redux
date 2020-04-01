import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import authenticationReducer from '../reducers/authentication';
import resetPasswordReducer from '../reducers/resetPassword';
import userInfoReducer from '../reducers/userInfo';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const enhancers = [];
const middleware = [thunk];

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    resetPassword: resetPasswordReducer,
    userInfo: userInfoReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export default () => {
  const store = createStore(persistedReducer, composedEnhancers);
  return { store, persistor: persistStore(store) };
};
