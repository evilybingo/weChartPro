import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "../detail.scss";
import { limitUnitList } from "../config";
import { get } from "lodash";
export default class ShareLimit extends Taro.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  render() {
    const { oilDetail } = this.props;
    return (
      <View className="share-limit">
        <View className="item">
          按加油金额<View className="sum-way">
            {get(oilDetail, ["limitBox", "length"])
              ? get(oilDetail, "limitBox")[0]["limitAddOil"] +
                "元/" +
                limitUnitList[get(oilDetail, "limitBox")[0]["limitKey"]]
              : "不限制"}
          </View>
        </View>
        <View className="tips">说明：如需调整共享卡限额请登录电脑版操作。</View>
      </View>
    );
  }
}
