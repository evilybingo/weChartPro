import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { showLoading, hideLoading } from "@utils/loading";
import CardTopInfo from "../card/components/info";
import { get } from "lodash";
import { connect } from "@tarojs/redux";
import Driver from "../card/components/driver";
import { AtTabs, AtTabsPane } from "taro-ui";
import { tabListTwo, tabListOne } from "../card/config";
import ConfirmModal from "./components/confirmModal";
//import CreateDriver from "../card/components/createDriver";
import ShareLimit from "./components/shareLimit";
import mapDispatchToProps from "@actions/oilDetail";
import "./detail.scss";
import { ModalComponent } from "../components/modal";

import { tipList, selfMaxLimit, shareMaxLimit } from "./config";

//import { ModalComponent } from '../components/modal'

class CardDetail extends Taro.Component {
  state = {
    current: 0,
    showIndex: 0,
    isOpened: false,
    isShow: false,
    tabList: tabListTwo,
    statusChange: false
  };
  config = {};

  componentWillMount() {
    const { aoId = 28477 } = this.$router.params;
    showLoading();
    this.props.getOilDetail({ aoId }).then(result => {
      hideLoading();
      if (get(result, ["res", "cardType"]) === 10) {
        Taro.setNavigationBarTitle({ title: "自有车充值卡" });
      }
      if (get(result, ["res", "cardType"]) === 20) {
        Taro.setNavigationBarTitle({ title: "自有车共享卡" });
      }
      if (get(result, ["res", "cardType"]) === 50) {
        Taro.setNavigationBarTitle({ title: "外请车结算卡" });
      }

      if (get(result, ["res", "shardAoId"])) {
        this.setState({
          tabList: tabListOne
        });
      }
    });
    this.props.bindDriverList({ aoId, status: 1 });
  }
  componentDidShow() {
    const { aoId = 28477 } = this.$router.params;
    const { refresh } = this.$scope.options;
    refresh && this.props.bindDriverList({ aoId, status: 1 });
  }
  handleClick(value) {
    this.setState({
      current: value
    });
  }
  showBindModal(showIndex) {
    this.setState({
      isOpened: true,
      showIndex
    });
  }
  showUnBindModal(showIndex, driverId) {
    this.setState({
      isOpened: true,
      showIndex,
      driverId
    });
  }
  closeModal = () => {
    this.setState({
      isOpened: false
    });
  };
  setCardStatus = cardStatus => {
    const { oilDetail, setOilCardStatus } = this.props;
    const aoId = get(oilDetail, "aoId");
    showLoading();
    setOilCardStatus({ aoId, cardStatus }).then(() => {
      // 返回列表须刷新
      this.changeOilCardStatus();
      this.props.getOilDetail({ aoId }).then(() => {
        hideLoading();
      });
      this.setState({
        isOpened: false
      });
    });
  };
  onOkHandler = () => {
    const { unBindDriver, oilDetail } = this.props;
    const { showIndex, driverId } = this.state;
    const aoId = get(oilDetail, "aoId");
    //1:取消冻结 2:解绑司机 3:油卡冻结

    if (showIndex === 1) {
      this.setCardStatus(1);
    } else if (showIndex === 2) {
      showLoading();
      /**
      *  aoId	账户id	是	[int]		查看
          2	driverIds	绑定司机ids	是	[array]		查看
          3	bindStatus	绑定状态 1：绑定 2：解绑
      */
      unBindDriver({
        payload: {
          aoId,
          bindStatus: 2,
          driverIds: [driverId]
        },
        cb: res => {
          hideLoading();
          // 返回列表须刷新
          this.changeOilCardStatus();

          this.props.bindDriverList({
            aoId,
            status: 1
          });
          this.setState({
            isOpened: false
          });
        }
      });
    } else if (showIndex === 3) {
      this.setCardStatus(2);
    }
  };
  showModal = () => {
    const { bindDrivers, oilDetail } = this.props;
    const cardType = get(oilDetail, "cardType");
    const conditionOne =
      get(bindDrivers, "length") >= shareMaxLimit && cardType === 50;
    const conditionTwo =
      get(bindDrivers, "length") >= selfMaxLimit &&
      (cardType === 10 || cardType === 20);
    let title;
    if (conditionOne || conditionTwo) {
      //判断已绑定司机数量是否超过限额（自有车卡15人；外请车卡1人）
      title = tipList[1];
    }
    if (title) {
      Taro.showToast({
        title: title,
        icon: "none"
      });
      return;
    }
    Taro.navigateTo({
      url:
        "../driver/create?isCreate=true&aoId=" +
        get(oilDetail, "aoId") +
        "&branchId=" +
        get(oilDetail, "createDept")
    });
    // this.setState({
    //   isOpened: !this.state.isOpened
    // });
  };
  closeRechargeModal = isSuccess => {
    this.setState({
      isShow: false
    });
    const { aoId } = this.$router.params;
    if (aoId) {
      this.changeOilCardStatus();
      this.props.getOilDetail({ aoId });
    }
  };
  showRechargeModal = () => {
    this.setState({
      isShow: true
    });
  };

  changeOilCardStatus = () => {
    this.setState({
      statusChange: true
    });
  };
  render() {
    const { isOpened, showIndex, current, tabList, isShow } = this.state;
    const { oilDetail, bindDrivers } = this.props;
    let driverLists = bindDrivers.map(driverList => {
      return {
        key: get(driverList, "employeeId"),
        name: `${get(driverList, "employeeName")}-${get(
          driverList,
          "employeePhone"
        )}`
      };
    });

    return (
      <View className="card-detail">
        <CardTopInfo oilDetail={oilDetail} />
        <View className="tab-box">
          <AtTabs
            current={current}
            tabList={tabList}
            onClick={this.handleClick.bind(this)}
          >
            <AtTabsPane current={current} index={0}>
              <Driver
                showUnBind={get(oilDetail, "cardType") !== 50}
                driverLists={driverLists}
                btnIndex={2}
                onShowBindModal={this.showUnBindModal.bind(this, 2)}
                onShowModal={this.showModal}
              />
            </AtTabsPane>
            {get(oilDetail, "shardAoId") &&
              <AtTabsPane current={current} index={1}>
                <ShareLimit oilDetail={oilDetail} />
              </AtTabsPane>}
          </AtTabs>
        </View>

        <View className="footer-wrapper">
          <View className="detail-footer">
            {get(oilDetail, "cardStatus") === 1
              ? <View className="at-row">
                  <View
                    className={
                      get(oilDetail, "cardType") !== 20
                        ? "at-col at-col-1 at-col--auto"
                        : "at-col at-col--auto"
                    }
                  >
                    <Button
                      class={
                        get(oilDetail, "cardType") !== 20
                          ? "oil-freeze-btn"
                          : "oil-freeze-btn widthMax"
                      }
                      onClick={this.showBindModal.bind(this, 3)}
                    >
                      油卡冻结
                    </Button>
                  </View>
                  {get(oilDetail, "cardType") !== 20 &&
                    <View className="at-col">
                      <Button
                        onTap={this.showRechargeModal}
                        type="primary"
                        size="normal"
                        class="oil-recharge-btn"
                      >
                        油卡充值
                      </Button>
                    </View>}
                </View>
              : <View className="at-row">
                  <View className="at-col">
                    <Button
                      onClick={this.showBindModal.bind(this, 1)}
                      className="cancel-oil-freeze"
                    >
                      取消冻结
                    </Button>
                  </View>
                </View>}
          </View>
        </View>

        <ConfirmModal
          onCancel={this.closeModal}
          isOpened={isOpened}
          onOkHandler={this.onOkHandler}
          currentIndex={showIndex}
        />

        {isShow &&
          <ModalComponent
            isShow={isShow}
            aoId={get(oilDetail, "aoId")}
            onClose={this.closeRechargeModal}
          />}
      </View>
    );
  }
}
CardDetail.propTypes = {};
function mapStateToProps({ oilDetail }) {
  return oilDetail;
}
export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);
