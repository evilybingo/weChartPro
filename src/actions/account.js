import createAction from "../utils/redux";
import {
  ACCOUNT,
  USER_INFO,
  SHARE_ACCOUNT,
  GET_AUTH_INFO
} from "../constants/namespace";
import {
  CURRENT_OIL_ACCOUNT_INFO,
  GET_USER_INFO,
  GET_SHARE_ACCOUNT,
  GET_AUTH
} from "../constants/api";

export default {
  getAccountInfo: () => {
    return createAction({
      url: CURRENT_OIL_ACCOUNT_INFO,
      type: ACCOUNT
    });
  },
  getUserInfo: () => {
    return createAction({
      url: GET_USER_INFO,
      type: USER_INFO
    });
  },
  getShareAccount: () => {
    return createAction({
      url: GET_SHARE_ACCOUNT,
      type: SHARE_ACCOUNT
    });
  },
  getAuth: () => {
    return createAction({
      url: GET_AUTH,
      type: GET_AUTH_INFO
    });
  }
};
