import Taro from "@tarojs/taro";
import { View, Button, Label } from "@tarojs/components";
import PropTypes from "prop-types";
import { get } from "lodash";

import "../detail.scss";
import { bgList, sumLimitUnitHandler } from "../config";

export default class CardTopInfo extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgImageIndex: 0
    };
  }
  componentDidMount() {
    this.setBgImg(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.setBgImg(nextProps);
  }
  setBgImg = nextProps => {
    const { oilDetail } = nextProps;
    let bgImageIndex = 0;
    if (Number(get(oilDetail, "aoCate")) && get(oilDetail, "cardStatus")) {
      bgImageIndex = `${get(oilDetail, "aoCate")}` + `${get(oilDetail, "cardStatus")}`;
    }
    this.setState({
      bgImageIndex
    });
  };

  render() {
    const { oilDetail } = this.props;
    const { bgImageIndex } = this.state;
    const { tit, sum } = sumLimitUnitHandler(oilDetail);
    let title = get(oilDetail, "cardType") === 20 ? tit : "油卡余额";

    return (
      <View className="card-info">
        <View className="info-box">
          <Image src={bgList[bgImageIndex]} className="card-bg" />
          <View className="title">
            <View className="name">
              <Label className="license">
                {!get(oilDetail, "truckNumber")
                  ? "未绑定车牌"
                  : get(oilDetail, "truckNumber")}
              </Label>
              <View className="balance">
                {sum !== "不限制" &&
                  <Text className="tit">
                    {title}
                  </Text>}
                {sum}
              </View>
            </View>
            <View className="company">
              {get(oilDetail, "belongCompanyName")}
            </View>
          </View>
          <View className="card-num">
            卡号：{get(oilDetail, "accountNumber")}
          </View>
        </View>
      </View>
    );
  }
}
CardTopInfo.propTypes = {
  oilDetail: PropTypes.object
};
