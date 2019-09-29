import Taro from "@tarojs/taro";
export function showLoading(params) {
  Taro.showLoading({
    title: "加载中",
    mask: true,
    ...params
  });
}
export function hideLoading(params) {
  Taro.hideLoading();
}
