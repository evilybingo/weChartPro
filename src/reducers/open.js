import { BUSSINESS_TYPE,CAR_LIST ,OPEN_CARD } from "../constants/namespace";
import { get } from "lodash";

const INITIAL_STATE = {
    bussiness_type_amount: {},
    car_list:[],
    createCardResult:{}
};

export default function open(state = INITIAL_STATE, action) {
  switch (action.type) {
    case BUSSINESS_TYPE:
      return {
        ...state,
        bussiness_type_amount: get(action, ["payload", "res"], {})
      };
   
    case CAR_LIST:
      return {
        ...state,
        car_list: get(action, ["payload", "res"], [])
      };
    case OPEN_CARD:
      return {
        ...state,
        createCardResult: get(action, ["payload", "res"], [])
      };
   
    default:
      return state;
  }
}
