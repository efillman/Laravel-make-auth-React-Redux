import {RESET_IN, RESET_OUT} from "../api/strings";

export const resetInUser = ({resetEmail, resetToken} = {}) => ({
    type: RESET_IN,
    resetInfo: {
      resetEmail,
      resetToken
    }
});

export const resetOutUser = () => ({
    type: RESET_OUT
});
