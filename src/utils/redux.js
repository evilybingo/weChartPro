import fetch from "./request";

export default function createAction(options) {
  const { url, payload = {}, fetchOptions, cb, type } = options;
  return dispatch => {
    return fetch({ url, payload, ...fetchOptions }).then(res => {
      dispatch({ type, payload: cb ? cb(res) : res,requestParams:payload });
      return res;
    });
  };
}
