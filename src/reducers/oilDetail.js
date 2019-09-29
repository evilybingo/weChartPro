import {
  OIL_DETAIL,
  UNBIND_DRIVER,
  BIND_DRIVER_LIST,
} from "../constants/namespace";
import { get } from "lodash";
const INITIAL_STATE = {
  oilDetail: {},
  bindDrivers: []
};

export default function oilDetail(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OIL_DETAIL:
      return {
        ...state,
        oilDetail: get(action, ["payload", "res"], {})
      };
    case BIND_DRIVER_LIST:
      return {
        ...state,
        bindDrivers: get(action, ["payload", "res", "bindInfo"], [])
      };

    default:
      return state;
  }
}
