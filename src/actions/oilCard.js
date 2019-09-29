import createAction from "@utils/redux";
import {
  OIL_CARD_LIST,
  OIL_CARD_RECHARGE,
  OIL_CARD_DETAIL_INFO,
  SET_NULL_OIL_CARD_LIST,
  LIST_NULL_FALG
} from "@constants/oilCard";
import {
  API_OIL_CARD_LIST,
  API_OIL_CARD_RECHARGE,
  OIL_CARD_DETAIL,
  GET_LIST_NULL_FALG
} from "@constants/api";

export default {
  // 油卡列表
  getMiniCardTab: ()=> {
    return createAction({
      url: GET_LIST_NULL_FALG,
      type: LIST_NULL_FALG,
    });
  },
  getOilCardList: payload => {
    return createAction({
      url: API_OIL_CARD_LIST,
      type: OIL_CARD_LIST,
      payload
    });
  },
  SetNullOilCardList: () => {
    return dispatch => {
      dispatch({
        type:SET_NULL_OIL_CARD_LIST
      });
    };
  },

  // 油卡详情 aoId
  getOilCardDetail: payload => {
    return createAction({
      url: OIL_CARD_DETAIL,
      type: OIL_CARD_DETAIL_INFO,
      payload
    });
  },

  // 油卡充值
  postOilCardRecharge: payload => {
    return createAction({
      url: API_OIL_CARD_RECHARGE,
      type: OIL_CARD_RECHARGE,
      payload
    });
  }
};
