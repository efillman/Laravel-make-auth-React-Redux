//bootstrap imports
require('./bootstrap');

//package imports
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

//configure redux
import configureStore from './store/configureStore';
const { persistor, store } = configureStore();

//import router
import AppRouter from './routers/AppRouter';

const App = () => (<AppRouter/>);

const jsx = (
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
        <App />
        </PersistGate>
      </Provider>
);

const appRoot = document.getElementById('app');
ReactDOM.render(jsx, appRoot);
