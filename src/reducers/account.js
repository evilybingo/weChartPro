import { ACCOUNT,USER_INFO ,SHARE_ACCOUNT,GET_AUTH_INFO} from "../constants/namespace";
import { get } from "lodash";

const INITIAL_STATE = {
  accountInfo: {},
  userInfo: {},
  shareAccounts:[],
  authInfo:{}
};

export default function account(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACCOUNT:
      return {
        ...state,
        accountInfo: get(action, ["payload", "res"], {})
      };
    case USER_INFO:
      return {
        ...state,
        userInfo: get(action, ["payload", "res"], {})
      };
    case SHARE_ACCOUNT:
      return {
        ...state,
        shareAccounts: get(action, ["payload", "res"], {})
      };
    case GET_AUTH_INFO:
      return {
        ...state,
        authInfo: get(action, ["payload", "res"], {})
      };
    default:
      return state;
  }
}
