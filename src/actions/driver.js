import createAction from "../utils/redux";
import { DRIVER_LIST, ADD_DRIVER } from "../constants/namespace";
import { DRIVER_LIST_API, CREATE_DRIVER } from "../constants/api";

export default {
  driverList: ({ payload }) => {
    return createAction({
      url: DRIVER_LIST_API,
      type: DRIVER_LIST,
      payload
    });
  },
  createDriver: payload => {
    return createAction({
      url: CREATE_DRIVER,
      type: ADD_DRIVER,
      payload
    });
  }
};
