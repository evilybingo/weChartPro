import Taro from "@tarojs/taro";
import { View, Button, Image } from "@tarojs/components";
import PropTypes from "prop-types";
import { get } from "lodash";
import { setWxInfo, haveToken } from "../../utils/storage";
import logo from "@images/logo.png";

import "./auth.scss";
export default class Auth extends Taro.Component {
  constructor(props) {
    super(props);
  }
  getAuth = res => {
    if (get(res, ["detail", "userInfo"])) {
      setWxInfo(get(res, "detail"));
      haveToken();
    }
  };
  componentWillMount() {}
  render() {
    return (
      <View className="auth-wrapper">
        <View className="auth-bg" />
        <View className="auth-box">
          <Image src={logo} className="logo" />
          <View className="title">为了给您提供完整功能需要获取一下权限</View>
          <View className="txt">获取您的公开信息（昵称、头像等）</View>
          <Button
            className="agree-btn"
            onGetUserInfo={this.getAuth}
            openType="getUserInfo"
          >
            同意授权
          </Button>
        </View>
      </View>
    );
  }
}
Auth.propTypes = {};
