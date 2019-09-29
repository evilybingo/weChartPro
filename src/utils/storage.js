import { USER_TOKEN, WX_INFO,MINI_VERSION ,DRIVER_INFO} from "@constants/namespace";
import Taro from "@tarojs/taro";

export const getToken = () => Taro.getStorageSync(USER_TOKEN); //用户token 登录标识
export const setToken = data => Taro.setStorageSync(USER_TOKEN, data);

export const getWxInfo = () => Taro.getStorageSync(WX_INFO); //微信授权信息
export const setWxInfo = data => Taro.setStorageSync(WX_INFO, data);

export const setMiniVersion = data => Taro.setStorageSync(MINI_VERSION, data);
export const getMiniVersion = () => Taro.getStorageSync(MINI_VERSION);

export const setDriverInfo = (data) => Taro.setStorageSync(DRIVER_INFO,data);
export const getDriverInfo = () => Taro.getStorageSync(DRIVER_INFO);
export const clearDriverInfo = () => Taro.removeStorageSync(DRIVER_INFO);
export const clearAllStorage = () => {
  Taro.removeStorageSync(USER_TOKEN)
  Taro.removeStorageSync(MINI_VERSION)
  Taro.removeStorageSync(DRIVER_INFO)
 
}
export const haveToken = () => {
  if (getToken()) {
    Taro.redirectTo({ url: "../index/index" });
  } else {
    Taro.redirectTo({ url: "../login/login" });
  }
};

export const firstPage = () => {
  if (getWxInfo()) {
    haveToken();
  } else {
    Taro.redirectTo({ url: "../auth/index" });
  }
};
