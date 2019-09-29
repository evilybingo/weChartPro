import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./index.scss";

import IconUp from "../assets/arrow-up.png";
import IconDown from "../assets/arrow-down.png";
import IconChecked from "../assets/icon-checked.png";
import IconCheck from "../assets/icon-check.png";

const slideUp = {
  cardSortShow: false,
  cardStatusShow: false
};

export default class SelectComponent extends Component {
  static defaultProps = {
    onChange: () => {},
    isCancel: false // 判断父组件边缘区域的点击事件
  };

  constructor() {
    super(...arguments);
    this.state = {
      cardSortShow: false,
      // cardSortList cardSort = 1，外请车，cardSort  =2 （自有车（充值和共享））
      cardSortList: [
        { value: "0", name: "全部类型" },
        { value: "2", name: "自有车加油卡" },
        { value: "1", name: "外请车结算卡" }
      ],
      cardSort: 0,
      cardStatusShow: false,
      cardStatus: 0,
      cardStatusList: [
        { value: "0", name: "全部" },
        { value: "1", name: "有效" },
        { value: "2", name: "冻结" }
      ]
    };
    // 标志位 记录当前的 item 是不是被重复点击
    this.currentItem = "";
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCancel) {
      this.currentItem = "";
      this.setState({
        ...slideUp
      });
    }
  }

  handleClick = key => {
    if (this.currentItem === key) {
      this.setState({
        ...slideUp
      });
      this.currentItem = "";
    } else {
      this.currentItem = key;
      this.setState({
        ...slideUp,
        [key]: true
      });
    }
  };

  onCancel = () => {
    this.currentItem = "";
    this.setState({
      ...slideUp
    });
  };

  preventTouchMove = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  onItemClick = (index, key, value) => {
    this.setState({
      [key]: index
    });
    this.onCancel();
    // 值改变 传递到父组件
    this.props.onChange(key, value);
  };

  render() {
    const {
      cardSortShow,
      cardSortList,
      cardSort,
      cardStatusShow,
      cardStatus,
      cardStatusList
    } = this.state;
    return (
      <View className="com-select">
        <View className="com-select__pane">
          <View
            className="com-select__pane-title"
            onClick={this.handleClick.bind(this, "cardSortShow")}
          >
            <View className={`${cardSortShow ? "active-item" : ""}`}>
              {cardSortList[cardSort].name}
            </View>
            <View className="icon-wrap">
              {cardSortShow
                ? <Image src={IconUp} className="icon" />
                : <Image src={IconDown} className="icon" />}
            </View>
          </View>
        </View>
        <View className="com-select__pane">
          <View
            className="com-select__pane-title"
            onClick={this.handleClick.bind(this, "cardStatusShow")}
          >
            <View className={`${cardStatusShow ? "active-item" : ""}`}>
              状态：{cardStatusList[cardStatus].name}
            </View>
            <View className="icon-wrap">
              {cardStatusShow
                ? <Image src={IconUp} className="icon" />
                : <Image src={IconDown} className="icon" />}
            </View>
          </View>
        </View>
        {(cardSortShow || cardStatusShow) &&
          <View
            className="com-select__pane-mask"
            onClick={this.onCancel}
            onTouchMove={this.preventTouchMove}
          />}
        <View
          className={`com-select__pane-ul ${cardSortShow ? "pane-show" : ""}`}
        >
          {cardSortList.map((item, index) => {
            return (
              <View
                className="com-select__pane-ul-li"
                key={item.value}
                onClick={this.onItemClick.bind(
                  this,
                  index,
                  "cardSort",
                  item.value
                )}
              >
                <Text>
                  {item.name}
                </Text>
                {index == cardSort
                  ? <Image src={IconChecked} className="icon" />
                  : <Image src={IconCheck} className="icon" />}
              </View>
            );
          })}
        </View>

        <View
          className={`com-select__pane-ul ${cardStatusShow ? "pane-show" : ""}`}
        >
          {cardStatusList.map((item, index) => {
            return (
              <View
                className="com-select__pane-ul-li"
                key={item.value}
                onClick={this.onItemClick.bind(
                  this,
                  index,
                  "cardStatus",
                  item.value
                )}
              >
                <Text>
                  {item.name}
                </Text>
                {index == cardStatus
                  ? <Image src={IconChecked} className="icon" />
                  : <Image src={IconCheck} className="icon" />}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
