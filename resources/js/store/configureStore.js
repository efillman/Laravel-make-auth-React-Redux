import { createStore, combineReducers, applyMiddleware } from 'redux';
import authenticationReducer from '../reducers/authentication';
import resetPasswordReducer from '../reducers/resetPassword';
import userInfoReducer from '../reducers/userInfo';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    resetPassword: resetPasswordReducer,
    userInfo: userInfoReducer,
});

export default () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(thunk)
    );

    return store;
};
