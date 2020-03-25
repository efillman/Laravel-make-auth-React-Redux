// default state
import {LOG_IN, LOG_OUT} from "../api/strings";

const authenticationReducerDefaultState = {
    isAuthenticated: false,
    accessToken: ""
};

// reducer which is a pure function
export default (state = authenticationReducerDefaultState, action) => {
    switch (action.type) {
        case LOG_IN:
            return {
                ...state,
                isAuthenticated: true,
                accessToken: action.authInfo.accessToken.toString()
            };
        case LOG_OUT:
            return {
                ...state,
                isAuthenticated: false,
                accessToken: ''
            };
        default:
            return state;
    }
};
