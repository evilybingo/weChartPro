import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { ModalComponent } from "../modal";
import PropTypes from "prop-types";
import { get } from "lodash";
import numeral from "numeral";
import "./index.scss";
// 外请卡 yellow 50
import USER_BLUE from "../assets/user-blue-icon.png";
import USER_YELLOW from "../assets/user-yellow-icon.png";
import USER_GROUP from "../assets/user-group.png";
import CAR_BLUE from "../assets/car-blue-icon.png";
import CAR_YELLOW from "../assets/car-yellow-icon.png";
import CAR_DEFAULT from "../assets/car-default.png";

const LIMIT_BOX = {
  0: "不限制",
  11: "单次可用",
  12: "本日可用",
  13: "本周可用",
  14: "本月可用"
};
export default class OilCardComponent extends Component {
  static defaultProps = {
    list: [],
    loading: false,
    hasMore: true,
    pageName: "list",
    onConfirm: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      aoId: 0,
      isShow: false
    };
  }

  handleClick = (aoId, e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      aoId,
      isShow: true
    });
  };

  closeModal=(isRefresh)=> {
    this.setState({
      aoId: 0,
      isShow: false
    });
    isRefresh && this.props.onConfirm();
  }

  goPage = aoId => {
    Taro.navigateTo({
      url: `/pages/oil-card-detail/detail?aoId=${aoId}`
    });
  };

  render() {
    const { aoId, isShow } = this.state;
    const { list, loading, hasMore } = this.props;
    return (
      <View className="oil-card-list">
        {list.length &&
          list.map(item => {
            // item.employeeBox = [{employeeName: '你好李四', employeePhone: '18121122222'}]
            // item.balance = 2000.00
            if (item.truckNumber) {
              item.truckNumber = item.truckNumber.toString().replace("--", "");
            }
            // item.truckNumber = '沪G623456'
            let nothing = !item.truckNumber && !item.employeeBox.length;
            let hasCarNo = Boolean(item.truckNumber);
            let onlyHasPerson =
              !item.truckNumber && Boolean(item.employeeBox.length);
            let hasBoth =
              Boolean(item.truckNumber) && Boolean(item.employeeBox.length);
            let ICON = CAR_DEFAULT;
            if (hasCarNo) {
              if (item.cardType == "50") {
                ICON = CAR_YELLOW;
              } else {
                ICON = CAR_BLUE;
              }
            } else if (onlyHasPerson) {
              if (item.cardType == "50") {
                ICON = USER_YELLOW;
              } else {
                ICON = USER_BLUE;
              }
            }

            let balance = item.balance || "0.00";
            let balanceText = "余额";
            if (get(item, "cardType") === 20) {
              if (get(item, ["limitBox", "length"]) > 0) {
                balance = item.limitBox[0].limitAddOil;
                balanceText = LIMIT_BOX[item.limitBox[0].limitKey];
              } else {
                balance = "";
              }
            }
            return (
              <View
                className="oil-card"
                onClick={this.goPage.bind(this, item.aoId)}
                key={item.aoId}
              >
                {/* 
							 *	1. 车牌号是否存在
							 *	2. 司机号码是否存在
							 *	3. 卡的类型
							 *	4. 绑定司机数量
							*/}
                <View className="oil-card-item card-header">
                  <Image className="icon" src={ICON} />
                  {nothing && <View className="oil-card-item__title">- -</View>}
                  {hasCarNo &&
                    <View className="oil-card-item__title">
                      {item.truckNumber}
                    </View>}
                  {onlyHasPerson &&
                    <View className="oil-card-item__title with-user">
                      <Text className="employ-txt">
                        {item.employeeBox[0].employeeName}-{item.employeeBox[0].employeePhone}
                      </Text>
                      {item.employeeBox.length > 1 &&
                        <Image
                          src={USER_GROUP}
                          className="oil-card-item__user-group"
                        />}
                    </View>}

                  {!balance
                    ? <View className="oil-card-item__balance oil-card-item__text-small">
                        <Text className="amount">不限制</Text>
                      </View>
                    : <View className="oil-card-item__balance oil-card-item__text-small">
                        <Text className="unit">￥</Text>
                        <Text className="amount">
                          {numeral(balance).format("0,0.00")}
                        </Text>
                        <View className="balance-tip">
                          {balanceText}
                        </View>
                      </View>}
                </View>
                {hasBoth &&
                  <View className="oil-card-item oil-card-item__text with-user">
                    <Text className="employ-txt">
                      {item.employeeBox[0].employeeName}-{item.employeeBox[0].employeePhone}
                    </Text>
                    {item.employeeBox.length > 1 &&
                      <Image
                        src={USER_GROUP}
                        className="oil-card-item__user-group"
                      />}
                  </View>}
                <View className="oil-card-item oil-card-item__text-small card-company">
                  {item.belongCompanyName}
                </View>
                <View className="oil-card-item card__footer">
                  <View className="oil-card-item__text-small">
                    卡号：{item.accountNumber}
                  </View>
                  <View className="oil-card-item__text">
                    {// 已冻结的 与共享卡均不可充值 司机转卡也不能充值的 cardSource: 20
                    item.cardStatus == 1 && item.cardType != 20
                      ? <Button
                          className="primary-btn-small"
                          onClick={this.handleClick.bind(this, item.aoId)}
                        >
                          充值
                        </Button>
                      : item.cardStatus == 2 && <Text>已冻结</Text>}
                  </View>
                </View>
              </View>
            );
          })}
        {loading
          ? <View className="oil-card-list__load-more">正在加载中...</View>
          : <View className="oil-card-list__load-more">
              {hasMore ? "加载更多~" : "没有更多了~"}
            </View>}

        {/* 充值弹层 */}
        {isShow &&
          <ModalComponent
            isShow={isShow}
            aoId={aoId}
            onClose={this.closeModal}
          />}
      </View>
    );
  }
}
OilCardComponent.propTypes = {
  list: PropTypes.array,
  onConfirm: PropTypes.func,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool
};
