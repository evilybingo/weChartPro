import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import "./index.scss";
import { get } from "lodash";
import { connect } from "@tarojs/redux";
import actions from "@actions/account";
import IconEmpty from "../assets/empty.png";
@connect(state => state.account, actions)
export default class NoOilCardComponent extends Component {
  goPage=()=> {
    this.props
      .getAuth()
      .then(result => {
        const isAuth = get(result, ["res", "createCard", "isAuth"]);
        if (isAuth === 1) {
          Taro.navigateTo({
            url: "/pages/card/open"
          });
        } else if (isAuth === 0) {
          Taro.showModal({
            content: "您的账号未开通该权限，请联系企业管理员为您开通！",
            showCancel: false,
            confirmText: "知道了"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <View className="no-card">
        <Image src={IconEmpty} className="no-card__image" />
        <View className="no-card__text">未发现匹配油卡</View>
        <View className="no-card__text">是否需要新开油卡</View>
        <Button className="no-card__btn" onClick={this.goPage}>
          去开卡
        </Button>
      </View>
    );
  }
}
