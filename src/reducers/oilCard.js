import {
  OIL_CARD_LIST,
  OIL_CARD_RECHARGE,
  OIL_CARD_DETAIL_INFO,
  SET_NULL_OIL_CARD_LIST
} from "@constants/oilCard";
import { get ,concat} from "lodash";
const INITIAL_STATE = {
  cardInfo: [],
  listPage: 1,
  oilCardDetail: {}
};

export default function oilCard(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OIL_CARD_LIST:
      return {
        ...state,
        cardInfo:concat(state.cardInfo,get(action, [ "payload", "res",'list'], [])),
        listPage:get(action, [ "requestParams", "page"],1)
      };
    case SET_NULL_OIL_CARD_LIST:
      return {
        ...state,
        cardInfo: []
      };
    case OIL_CARD_RECHARGE:
      return {
        ...state,
        ...action.payload
      };
    case OIL_CARD_DETAIL_INFO:
      return {
        ...state,
        oilCardDetail: get(action, ["payload", "res"], {})
      };
    default:
      return state;
  }
}
