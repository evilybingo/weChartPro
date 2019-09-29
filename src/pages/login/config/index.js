import { get } from "lodash";
export const errorTips = {
  0: "登录成功",
  1: "该用户已被注销！",
  2: "用户名/密码错误！",
  3: "您的账号未开通该权限；请联系企业管理员为您开通！",
  4: "该用户不存在",
  5: "请输入用户名",
  6: "请输入密码",
  7: "密码仅支持英文字母+数字"
};
export function valCheck({ pattern, username, password }) {
  let num = 0;
  if (!username) {
    num = 5;
  } else if (!password) {
    num = 6;
  }
  //  else if ( !pattern.test(password)) {
  //   num = 7;
  // }
  return num;
}
