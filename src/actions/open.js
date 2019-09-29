import createAction from "../utils/redux";
import { BUSSINESS_TYPE ,CAR_LIST,OPEN_CARD,CREATE_CAR} from "../constants/namespace";
import { BIZ_TYPE_API ,GET_CAR_LIST,CREATE_CARD,GET_PROVINCE_NAME,CREATE_CAR_API} from "../constants/api";

export default {
  bussinessType: () => {
    return createAction({
      url: BIZ_TYPE_API,
      type: BUSSINESS_TYPE,
    });
  },
  getCarList: (payload) => {
    return createAction({
      url: GET_CAR_LIST,
      type: CAR_LIST,
      payload
    });
  },
  openCard:(payload)=>{
    return createAction({
      url: CREATE_CARD,
      type: OPEN_CARD,
      payload
    });
  },
  createCar:(payload)=>{
    return createAction({
      url: CREATE_CAR_API,
      type: CREATE_CAR,
      payload
    });
  }
};
