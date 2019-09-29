import createAction from "../utils/redux";
import { OIL_DETAIL, UNBIND_DRIVER,BIND_DRIVER_LIST,OIL_CARD_STATUS_SET } from "../constants/namespace";
import {
  SET_BIND_DRIVER,
  OIL_CARD_DETAIL,
  SET_OIL_CARD_STATUS,
  CARD_BIND_DRIVER
} from "../constants/api";

export default {
  unBindDriver: ({ payload, cb }) => {
    return createAction({
      url: SET_BIND_DRIVER,
      type: UNBIND_DRIVER,
      payload,
      cb
    });
  },
  bindDriverList: payload => {
    return createAction({
      url: CARD_BIND_DRIVER,
      type: BIND_DRIVER_LIST,
      payload
    });
  },
  getOilDetail: payload => {
    return createAction({
      url: OIL_CARD_DETAIL,
      type: OIL_DETAIL,
      payload
    });
  },
  setOilCardStatus: payload => {
    return createAction({
      url: SET_OIL_CARD_STATUS,
      type: OIL_CARD_STATUS_SET,
      payload
    });
  },

};
