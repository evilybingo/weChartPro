import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import Index from "./pages/index";
import configStore from "./store";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  state = {};
  config = {
    pages: [
      "pages/loading/loading",
      "pages/login/login",
      "pages/driver/create",
      "pages/card/open",
      "pages/oil-card-detail/detail",
      "pages/open-card-result/result",
      "pages/index/index",
      "pages/auth/index",
      "pages/oil-card-list/oil-card-list",
      "pages/oil-card-search/oil-card-search",
    ],
    permission: {
      // "scope.userLocation": {
      //   desc: "你的位置信息将用于小程序位置接口的效果展示"
      // }
    },
    window: {
      navigationBarTitleText:'老吕加油企业版',
      backgroundTextStyle: "light",
      navigationBarTitleText: "WeChat",
      navigationBarBackgroundColor: "#00152a",
      navigationBarTextStyle: "white"
    }
  };
  globalData={}
  componentWillMount() {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: "更新提示",
              content: "新版本已准备好，请重启小程序！",
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请删除后重新添加小程序！",
              showCancel: false
            });
          });
        }
      });
    }
  }
  /**
   * 监听用户点击页面内转发按钮（Button 组件 openType='share'）或右上角菜单“转发”按钮的行为，并自定义转发内容。
   */
  onShareAppMessage(res) {
    /**
     * button：页面内转发按钮；menu：右上角转发菜单
     */
    const { webViewUrl, target, from } = res;
    if (from === "button") {
      console.log(res.target);
    }
  }

  /**
   * 监听用户下拉刷新事件
   * 需要在全局配置的 window 选项中或页面配置中开启 enablePullDownRefresh
   * 可以通过 Taro.startPullDownRefresh 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
   * 当处理完数据刷新后，Taro.stopPullDownRefresh 可以停止当前页面的下拉刷新
   */
  onPullDownRefresh() {}

  /**
   * 监听用户上拉触底事件
   * 可以在全局配置的 window 选项中或页面配置中设置触发距离 onReachBottomDistance
   * 在触发距离内滑动期间，本事件只会被触发一次
   */
  onReachBottom() {}

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
