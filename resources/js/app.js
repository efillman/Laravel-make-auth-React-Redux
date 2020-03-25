//bootstrap imports
require('./bootstrap');

//package imports
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

//configure redux
import configureStore from './store/configureStore';

//import router
import AppRouter from './routers/AppRouter';

const store = configureStore();

const App = () => (<AppRouter/>);

const jsx = (<Provider store={store}>
    <App/>
</Provider>);

const appRoot = document.getElementById('app');
ReactDOM.render(jsx, appRoot);
