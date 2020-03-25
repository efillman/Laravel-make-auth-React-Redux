// default state
import {RESET_IN, RESET_OUT} from "../api/strings";

const resetPasswordReducerDefaultState = {
    resetEmail: "",
    resetToken: ""
};

// reducer which is a pure function
export default (state = resetPasswordReducerDefaultState, action) => {
    switch (action.type) {
        case RESET_IN:
            return {
                ...state,
                resetEmail: action.resetInfo.resetEmail.toString(),
                resetToken: action.resetInfo.resetToken.toString()
            };
        case RESET_OUT:
            return {
                ...state,
                resetEmail: "",
                resetToken: ""
            };
        default:
            return state;
    }
};
