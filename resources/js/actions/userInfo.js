import {USERINFO_IN, USERINFO_OUT} from "../api/strings";

export const userInfoIn = ({userName, userEmail, userActive} = {}) => ({
    type: USERINFO_IN,
    userInfo: {
      userName,
      userEmail,
      userActive
    }
});

export const userInfoOut = () => ({
    type: USERINFO_OUT
});
