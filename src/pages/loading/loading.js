import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { firstPage } from "@utils/storage";

export default class Loading extends Taro.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    firstPage();
  }
  render() {
    return (
      <View className="loading-box">
        <View className="loading">
          <View className="box dot">
            <View className="dot-item" />
            <View className="dot-item" />
            <View className="dot-item" />
          </View>
        </View>
      </View>
    );
  }
}
