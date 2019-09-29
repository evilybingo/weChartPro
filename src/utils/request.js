import Taro from "@tarojs/taro";
import { get } from "lodash";
import { USER_TOKEN, MINI_VERSION } from "@constants/namespace";
import { clearAllStorage } from "./storage";

const CODE_SUCCESS = 0; // 成功的请求
const CODE_ERROR = 1; // 操作失败
const CODE_AUTH_EXPIRED = 101001; // 登录过期
const CODE_UPDATE_VERSION = 55131; // 版本更新
const CODE_NO_AUTH = 57008; // 没权限
const CODE_403 = 403; // 该帐号已在其他设备上登录！

const token_status = {
  "401": 401,
  "405": 405
};

function outToLogin() {
  clearAllStorage();
 let num= setTimeout(() => {
    Taro.reLaunch({
      url: "/pages/login/login"
    });
    clearTimeout(num)
  }, 2000);
}
export default async function fetch(options) {
  //Taro.getStorageSync(STORAGE_TOKEN) ||
  const { url, payload, showToast = true } = options;
  const token = Taro.getStorageSync(USER_TOKEN);
  const miniversion = Taro.getStorageSync(MINI_VERSION);
  const header = {
    "content-type": "application/json",
    token: token || "",
    Authorization: "Bearer " + token || "",
    miniversion,
    // 'B6EDADA66ECB4375D1438B0EE5A4DEBA': 1803,
    //'device': 5,
    //'device-name': 'wechat_mp',
    "device-version": "2.0.0",
    bury: url,
    timestamp: new Date().getTime()
  };
  return Taro.request({
    url: `${url}?t=${new Date().getTime()}`,
    method: "POST",
    data: payload,
    header
  })
    .then(result => {
      let title;
      if (
        token_status[get(result, "statusCode")] === get(result, "statusCode")
      ) {
        title = "登录失效，请重新登录";
      } else if (get(result, "statusCode") === CODE_403) {
        title = "该帐号已在其他设备上登录！";
      }
      if (title) {
        Taro.showToast({
          title,
          icon: "none"
        });
        outToLogin();
        return;
      }
      Taro.hideLoading();
      const { err } = get(result, "data", {});
      if (err !== CODE_SUCCESS) {
        if (err === CODE_AUTH_EXPIRED) {
          Taro.clearStorage();
        }
        return Promise.reject(get(result, "data", {}));
      }
      return get(result, "data", {});
    })
    .catch(err => {
      let error_code = get(err, "err");
      Taro.hideLoading();
      let msg = error_code === CODE_AUTH_EXPIRED ? "登录失效，请重新登录" : "请求异常";
      msg = error_code === CODE_UPDATE_VERSION ? "版本更新，请重新登录" : "请求异常";
      // if (error_code === CODE_NO_AUTH) {
      //   Taro.showModal({
      //     content: "您的账号未开通该权限；请联系企业管理员为您开通！",
      //     showCancel: false,
      //     confirmText: "知道了"
      //   });
      //   return;
      // }
      if (showToast) {
        wx.showToast({
          title: (err && err.msg) || msg,
          icon: "none",
          duration:2000
        });
      }

      if (
        error_code === CODE_AUTH_EXPIRED ||
        error_code === CODE_UPDATE_VERSION
      ) {
        outToLogin();
      }

      return Promise.reject({ msg, ...err });
    });
}
