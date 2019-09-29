import { DRIVER_LIST } from "../constants/namespace";

const INITIAL_STATE = {
    list: {}
};

export default function driver(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DRIVER_LIST:
      return {
        ...state,
        list: action.payload
      };
    default:
      return state;
  }
}
