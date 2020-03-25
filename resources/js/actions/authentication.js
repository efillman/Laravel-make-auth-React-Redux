import {LOG_IN, LOG_OUT} from "../api/strings";

export const loginUser = ({accessToken} = {}) => ({
    type: LOG_IN,
    authInfo: {
      accessToken
    }
});

export const logoutUser = () => ({
    type: LOG_OUT
});
