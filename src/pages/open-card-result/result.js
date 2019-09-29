import Taro from "@tarojs/taro";
import { View, Label, Image, Button, Text } from "@tarojs/components";
import "./result.scss";
import { connect } from "@tarojs/redux";
import { showLoading, hideLoading } from "@utils/loading";
import mapDispatchToProps from "@actions/oilDetail";
import { sumHandler } from "../card/config";
import card_icon from "@images/icons/card_icon.png";
import numeral from "numeral";
import { get } from "lodash";
class OpenCardResult extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardTypeList: {
        1: "-",
        10: "自有车充值卡",
        20: "自有车共享卡",
        50: "外请车结算卡"
      }
    };
  }
  config = {
    navigationBarTitleText: "开卡结果"
  };
  componentWillMount() {
    showLoading();
    const { aoId = 8965 } = this.$router.params;
    this.props.getOilDetail({ aoId }).then(result => {
      hideLoading();
    });
    this.props.bindDriverList({ aoId, status: 1 });
  }
  back = () => {
    Taro.reLaunch({
      url: "../index/index"
    });
  };
  goDetail = () => {
    const { aoId = 28477 } = this.$router.params;
    Taro.navigateTo({
      url: "../oil-card-detail/detail?aoId=" + aoId
    });
  };
  componentWillUnmount() {
    Taro.reLaunch({
      url: "../index/index"
    });
  }
  render() {
    const { cardTypeList } = this.state;
    const { oilDetail, bindDrivers } = this.props;
    const lists_one = [
      { key: "no", title: "油卡编号", content: get(oilDetail, "accountNumber") },
      {
        key: "type",
        title: "油卡类型",
        content: cardTypeList[get(oilDetail, "cardType", 1)]
      },
      {
        key: "sum",
        title: get(oilDetail, "cardType") === 20 ? "限制额度" : "油卡余额",
        content: sumHandler(oilDetail),
        orange: true
      }
    ];
    const lists_two = [
      {
        key: "truckNumber",
        title: "车牌号",
        content: !get(oilDetail, "truckNumber")
          ? "--"
          : get(oilDetail, "truckNumber")
      },
      {
        key: "driver",
        title: "司机",
        content: "共" + get(bindDrivers, "length", 0) + "人"
      }
    ];

    return (
      <View className="card-result">
        <View className="result-top">
          <Label className="tit">开卡成功</Label>
          <Image src={card_icon} className="card-icon" />
        </View>

        <View className="result-list-box">
          <View className="title">基本信息</View>
          <View className="result-list">
            {lists_one.map((item, index) => {
              return (
                <View className="item" key={item.key}>
                  <Label className="tit">
                    {item.title}：
                  </Label>
                  <Text className={item.orange ? "txt orange" : "txt"}>
                    {item.content}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="result-list-box mb160">
          <View className="title">绑定信息</View>
          <View className="result-list ">
            {lists_two.map((item, index) => {
              return (
                <View className="item" key={item.key}>
                  <Label className="tit">
                    {item.title}：
                  </Label>
                  <Text className="txt">
                    {item.content}
                  </Text>
                </View>
              );
            })}
            <View className="driver-list">
              {get(bindDrivers, "length") &&
                bindDrivers.map(driver => {
                  return (
                    <View
                      className="list"
                      key={get(driver, "employeeId")}
                    >{`${get(driver, "employeeName")}-${get(
                      driver,
                      "employeePhone"
                    )}`}</View>
                  );
                })}
            </View>
          </View>
          <View className="btn-box">
            <Button className="btn" onTap={this.goDetail}>
              查看油卡
            </Button>
            <Button className="btn" onTap={this.back}>
              返回
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
OpenCardResult.propTypes = {};
function mapStateToProps({ oilDetail }) {
  return oilDetail;
}
export default connect(mapStateToProps, mapDispatchToProps)(OpenCardResult);
