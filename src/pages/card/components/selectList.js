import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "../detail.scss";
import PropTypes from "prop-types";
import { get } from "lodash";
import arrow_top from "@images/icons/arrow_top.png";
export default class SelectList extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRemove: false
    };
  }
  componentWillMount() {}
  chooseCurrent = list => {
    this.props.onChooseCurrent(list);
  };

  render() {
    const { lists = [], onRemoveThis } = this.props;

    return (
      <View className="select-list">
        <View className="select-mask" onClick={onRemoveThis} />
        <View className="driver-box">
          <Image src={arrow_top} className="arrow-top" />
          <View className="driver-list">
            {lists.map((list, index) => {
              const bindName =
                get(list, "bindStatus") === 1 //&& get(list, "carType") !== 2
                  ? "（已绑定油卡）"
                  : ""; //1已绑定 2 未绑定
              return (
                <View
                  className="item"
                  key={`${list.key}${index}`}
                  hoverClass="blue"
                  onClick={this.chooseCurrent.bind(this, list)}
                >
                  {get(list, "carNumber")
                    ? `${get(list, "carNumber")}${bindName}`
                    : `${get(list, "employeeName")}-${get(
                        list,
                        "employeeMobile"
                      )}`}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}
SelectList.propTypes = {
  lists: PropTypes.array,
  onChooseCurrent: PropTypes.func, //选中下拉列表某一条数据触发的事件
  onHide: PropTypes.func //点击蒙层触发
};
