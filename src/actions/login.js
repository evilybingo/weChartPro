import createAction from "../utils/redux";
import { LOGIN } from "../constants/namespace";
import { LOGIN_GET_TOKEN } from "../constants/api";

export default {
  login: ({ payload }) => {
    return createAction({
      url: LOGIN_GET_TOKEN,
      type: LOGIN,
      payload
    });
  }
};
//  // 异步的action
//  export function asyncAdd () {
//    return dispatch => {
//      setTimeout(() => {
//        dispatch(add())
//      }, 2000)
//    }
//  }
