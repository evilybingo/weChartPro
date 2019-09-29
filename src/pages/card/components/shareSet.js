import Taro from "@tarojs/taro";
import { View, Label, Input, Text, Picker } from "@tarojs/components";
import PropTypes from "prop-types";
import { get, nth } from "lodash";
import { connect } from "@tarojs/redux";
import mapDispatchToProps from "@actions/account";
import { limitCondition, limitInitList } from "../config";
import arrow_bottom from "@images/icons/arrow_bottom.png";
import "../detail.scss";

class ShareSet extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeIndex: "0",
      limitInitIndex: "0",
      limitTimeIndex: "0",
      disabled: false,
      limitIndex: 1,
      accountTypes: []
    };
  }
  componentWillMount() {
    //   这里添加一个接口 获取可共享账户 list   setState accountTypes
    let typeIndex;

    this.props.getShareAccount().then(result => {
      get(result, "res", []).map((shareAccount, key) => {
        if (get(shareAccount, "shareAoType") === 1) {
          typeIndex = key;
          this.props.onShareAccount(shareAccount);
        }
      });
    });
    this.setState({
      typeIndex
    });
  }
  bindPickerChange = event => {
    const { shareAccounts } = this.props;
    let typeIndex = event.detail.value;
    this.setState({
      typeIndex
    });
    this.props.onShareAccount(nth(shareAccounts, typeIndex));
  };
  toggle = () => {
    const { disabled } = this.state;
    this.setState({
      disabled: !disabled
    });
  };
  limitChange = limitIndex => {
    this.setState({
      limitIndex
    });
    this.props.onLimitChange(limitIndex);
  };
  limitTimeChange = event => {
    let limitTimeIndex = get(event, ["detail", "value"]);
    this.setState({ limitTimeIndex });
    this.props.onLimitTimeChange(nth(limitInitList, limitTimeIndex));
  };
  limitAmountChange = event => {
    this.props.onLimitAmount(get(event, ["detail", "value"]));
  };

  render() {
    const { shareAccounts } = this.props;
    const {
      limitAmount,
      typeIndex,
      limitIndex,
      limitInitIndex,
      limitTimeIndex
    } = this.state;

    return (
      <View className="share-box">
        <View className="share-set">
          <View className="title">共享设置</View>
          <View className="set-box">
            <View className="set-item share-set-item">
              <Label className="set-label">共享账户</Label>
              <Picker
                name="sharedAoId"
                className="picker-box"
                onChange={this.bindPickerChange}
                value={typeIndex}
                range={shareAccounts}
                rangeKey="title"
              >
                <View className="picker">
                  {shareAccounts[typeIndex].title}
                </View>
                <Image src={arrow_bottom} className="picker-icon" />
              </Picker>
            </View>
            <View className="set-item">
              <Label className="set-label flex-box">额度限制</Label>
              <View className="limit-box">
                <View
                  className={
                    limitIndex === 2 ? "limit-item blue" : "limit-item"
                  }
                  onClick={this.limitChange.bind(this, 2)}
                >
                  不限制
                </View>
                <View
                  className={
                    limitIndex === 1 ? "limit-item blue" : "limit-item"
                  }
                  onClick={this.limitChange.bind(this, 1)}
                >
                  限制
                </View>
              </View>
            </View>
            {limitIndex === 1 &&
              <View>
                <View className="set-item">
                  <Label className="set-label">限制条件</Label>
                  <Picker
                    name="limitCondition"
                    className="picker-box"
                    range={limitCondition}
                    rangeKey="name"
                    value="0"
                  >
                    <View className="picker">
                      {limitCondition[0].name}
                    </View>
                    <Image src={arrow_bottom} className="picker-icon" />
                  </Picker>
                </View>
                <View className="set-item">
                  <Label className="set-label">限制额度</Label>
                  <Picker
                    name="limitInit"
                    onChange={this.limitTimeChange}
                    className={
                      limitInitIndex === "0"
                        ? "picker-box limit-width gray"
                        : "picker-box limit-width"
                    }
                    value={limitTimeIndex}
                    range={limitInitList}
                    rangeKey="name"
                  >
                    <View className="picker">
                      {limitInitList[limitTimeIndex].name}
                    </View>
                    <Image src={arrow_bottom} className="picker-icon" />
                  </Picker>
                  <Text className="limit-txt">--</Text>
                  <Input
                    onInput={this.limitAmountChange}
                    type="digit"
                    maxLength="12"
                    name="limitAmount"
                    className="limit-amount"
                    placeholderClass="gary"
                    placeholder="请输入金额"
                  />
                  <Text className="unit-money">元</Text>
                </View>
              </View>}
          </View>
        </View>
        {limitIndex === 2 &&
          <View className="tip-limit">为保障您的油费安全，启用系统默认限制额度：5万元/天</View>}
      </View>
    );
  }
  onGetLimitTime;
}
ShareSet.propTypes = {
  onLimitTimeChange: PropTypes.func, //选择限制额度的每次 事件
  onShareAccount: PropTypes.func, //选择共享账户
  limitChange: PropTypes.func, //额度限制
  onLimitAmount: PropTypes.func //额度（金额）
};
function mapStateToProps({ account }) {
  return account;
}
export default connect(mapStateToProps, mapDispatchToProps)(ShareSet);
