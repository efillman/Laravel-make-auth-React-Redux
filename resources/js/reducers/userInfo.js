// default state
import {USERINFO_IN, USERINFO_OUT} from "../api/strings";

const userInfoReducerDefaultState = {
    userName: "",
    userEmail: "",
    userActive: 0
};

// reducer which is a pure function
export default (state = userInfoReducerDefaultState, action) => {
    switch (action.type) {
        case USERINFO_IN:
            return {
                ...state,
                userName: action.userInfo.userName.toString(),
                userEmail: action.userInfo.userEmail.toString(),
                userActive: action.userInfo.userActive
            };
        case USERINFO_OUT:
            return {
                ...state,
                userName: "",
                userEmail: "",
                userActive: 0
            };
        default:
            return state;
    }
};
