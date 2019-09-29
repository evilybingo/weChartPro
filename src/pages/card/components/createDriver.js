import Taro from "@tarojs/taro";
import { View, Button, Label, Input } from "@tarojs/components";
import PropTypes from "prop-types";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import "../detail.scss";
import close_icon from "@images/icons/close_icon.png";
export default class CreateDriver extends Taro.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  render() {
    const { isOpened, onClose } = this.props;
    return (
      <View className="create-driver">
        <AtModal
          isOpened={isOpened}
          closeOnClickOverlay={false}
          onClose={onClose}
        >
          <AtModalHeader>
            <Image
              src={close_icon}
              className="close-icon"
              onClick={onClose}
            />请输入司机信息
          </AtModalHeader>
          <AtModalContent>
            <View className="driver-item">
              <Label className="title">
                <Text className="not-null">*</Text>手机号码
              </Label>
              <Input
                type="number"
                className="input-box"
                placeholderClass="gray"
                placeholder="请输入司机手机号码"
              />
            </View>
            <View className="driver-item">
              <Label className="title">
                <Text className="not-null">*</Text>司机姓名
              </Label>
              <Input
                type="number"
                className="input-box"
                placeholderClass="gray"
                placeholder="请输入司机姓名"
              />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button className="cancel-btn" onClick={onClose}>
              取消
            </Button>
            <Button className="sure-btn">确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}
CreateDriver.propTypes = {
  isOpened: PropTypes.bool,
  onClose: PropTypes.func
};
