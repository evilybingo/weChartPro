import Taro from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import PropTypes from "prop-types";
import { AtFloatLayout } from "taro-ui";
import { get } from "lodash";
import "../detail.scss";
export default class ConfirmModal extends Taro.Component {
  handleClick = () => {
    this.props.onOkHandler();
  };

  handleCancel = () => {
    this.props.onCancel();
  };
  render() {
    const { isOpened, currentIndex } = this.props;
    const textList = {
      0: {
        tit: "取消冻结后，司机可继续使用该油卡加油！",
        okTxt: "确认取消",
        cancelTxt: "保持冻结"
      },
      1: {
        tit: "取消冻结后，司机可继续使用该油卡加油！",
        okTxt: "确认取消",
        cancelTxt: "保持冻结"
      },
      2: {
        tit: "司机解绑后，该司机将不能使用该油卡加油！",
        okTxt: "确认解绑",
        cancelTxt: "取消操作"
      },
      3: {
        tit: "油卡冻结后，司机将不能使用该油卡加油！",
        okTxt: "确认冻结",
        cancelTxt: "取消操作"
      }
    };
    const { tit, cancelTxt, okTxt } = get(textList, currentIndex, {});

    return (
      <AtFloatLayout isOpened={isOpened} onClose={this.handleCancel}>
      <View className="float-title">{tit}</View>
        <Button onClick={this.handleClick} className="confirm-btn border">
          {okTxt}
        </Button>
        <Button onClick={this.handleCancel} className="confirm-btn">
          {cancelTxt}
        </Button>
      </AtFloatLayout>
    );
  }
}
ConfirmModal.propTypes = {
  onOkHandler: PropTypes.func,
  onCancel: PropTypes.func,
  isOpened: PropTypes.bool,
  index: PropTypes.number
};
