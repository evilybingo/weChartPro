import Taro from "@tarojs/taro";
import { get } from "lodash";
import { View, Image, Label, Text } from "@tarojs/components";
import PropTypes from "prop-types";
import "../detail.scss";

import add_driver from "@images/icons/add_driver.png";
import driver_icon from "@images/icons/driver_icon.png";

export default class Driver extends Taro.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  unBind(key) {
    this.props.onShowBindModal(key);
  }
  render() {
    const {
      onShowModal,
      className,
      btnIndex,
      showUnBind,
      driverLists
    } = this.props;

    return (
      <View className={`driver-wrapper ${className}`}>
        {btnIndex === 1
          ? <View className="driver-item">
              <Label className="tit">绑定司机</Label>
              <View className="add-driver" onTap={onShowModal}>
                <Image src={add_driver} className="icon" />
                <Text className="txt">添加司机</Text>
              </View>
            </View>
          : <View className="add-btn" onTap={onShowModal}>
              <Image src={add_driver} className="icon" />
              <Text className="tit">添加司机</Text>
            </View>}
        {get(driverLists, "length") &&
          <View className="driver-list">
            {driverLists.map((driverList, index) => {
              return (
                <View
                  className="item"
                  key={`${get(driverList, "key")}${index}`}
                >
                  <Label className="name">
                    <Image src={driver_icon} className="icon" />
                    <Text className="txt">
                      {get(driverList, "name")}
                    </Text>
                  </Label>
                  {showUnBind &&
                    <View
                      className="unbind"
                      onTap={this.unBind.bind(this, driverList.key)}
                    >
                      解绑
                    </View>}
                </View>
              );
            })}
          </View>}
      </View>
    );
  }
}
Driver.propTypes = {
  driverLists: PropTypes.array, //司机list
  onShowBindModal: PropTypes.func, //解绑
  onShowModal: PropTypes.func, //点击添加司机的触发的事件
  className: PropTypes.string, //父组件传进的单独类选择器
  btnIndex: PropTypes.number, //1:油卡详情的司机列表 2:开卡的司机列表
  showUnBind: PropTypes.bool //解绑按钮显示隐藏
};
