import Taro from "@tarojs/taro";

import { View, Form, Input, Picker, Button, Image } from "@tarojs/components";
import PropTypes from "prop-types";
import numeral from "numeral";
import arrow_bottom from "@images/icons/arrow_bottom.png";
import clear_icon from "@images/icons/clear_icon.png";
import { getDriverInfo, clearDriverInfo, setDriverInfo } from "@utils/storage";

import { showLoading, hideLoading } from "@utils/loading";
import mapDispatchToProps from "@actions/open";
import mapAccountDispatchToProps from "@actions/account";
import ShareSet from "./components/shareSet";
import SelectList from "./components/selectList";
import {
  defaultState,
  createCardTips,
  openPattern,
  openCardSubTips
} from "./config";
import { get, concat } from "lodash";
import { connect } from "@tarojs/redux";
import Driver from "./components/driver";
import "./detail.scss";
class OpenComp extends Taro.Component {
  constructor(props) {
    super(props);
    //let lastState = getOpenCardInfo() || {};
    this.state = defaultState;
  }
  config = {
    navigationBarTitleText: "开卡"
  };
  carSearchDefaultCondition = {
    isNeedHeadAll: 1,
    status: -1,
    pageSize: 5,
    page: 1,
    isNeedBindStatus: 1
  };
  componentWillMount() {
    this.props.getAccountInfo();
    this.props.bussinessType();
  }
  componentDidShow() {
    const { driverLists } = this.state;
    const { driverId, drivers } = getDriverInfo() || {};
    if (driverId) {
      let newDriverLists = concat(driverLists, {
        name: drivers,
        key: driverId
      });
      clearDriverInfo();
      setDriverInfo(newDriverLists);
      this.setState({
        driverLists: newDriverLists
      });
    }
  }
  componentWillUnmount() {
    clearDriverInfo();
    Taro.reLaunch({
      url: "../index/index"
    });
  }
  showBindModal = key => {
    //解绑
    const { driverLists } = this.state;
    let newList = driverLists.filter(driverList => driverList.key !== key);
    this.setState({
      driverLists: newList
    });
    setDriverInfo(newList);
  };
  bindPickerChange = event => {
    const typeIndex = get(event, ["detail", "value"], "0");
    this.setState({
      typeIndex
    });
  };

  goCreateDriver = () => {
    const { typeIndex, driverLists } = this.state;
    if (
      (typeIndex === "3" && get(driverLists, "length") >= 1) ||
      get(driverLists, "length") >= 15
    ) {
      Taro.showToast({
        title: createCardTips[8],
        icon: "none",
        mask: true
      });
      return;
    }
    Taro.navigateTo({
      url: "../driver/create"
    });
  };

  reallyOpenCard = res => {
    const { openCard, getAuth } = this.props;
    let payload = openPattern(res);

    if (payload) {
      Taro.showLoading();
      getAuth().then(result => {
        if (get(result, ["res", "createCard", "isAuth"]) === 1) {
          this.setState({
            isOpening: true
          });
          openCard(payload)
            .then(openRes => {
              this.setState({
                isOpening: false
              });
              Taro.hideLoading();
              if (get(openRes, "err") === 0) {
                Taro.navigateTo({
                  url:
                    "../open-card-result/result?aoId=" +
                    get(openRes, ["res", "aoId"])
                });
              }
            })
            .catch(err => {
              this.setState({
                isOpening: false
              });
              console.log(err);
            });
        } else if (get(result, ["res", "createCard", "isAuth"]) === 0) {
          Taro.showModal({
            content: "您的账号未开通该权限，请联系企业管理员为您开通！",
            showCancel: false,
            confirmText: "知道了",
            success(res) {
              if (res.confirm) {
                Taro.reLaunch({ url: "../index/index" });
              }
            }
          });
        }
      });
    }
  };
  openCard = event => {
    let amount = get(event, ["detail", "value", "amount"]);
    let truckName = get(event, ["detail", "value", "truckName"]);
    let remark = get(event, ["detail", "value", "remark"]);

    const { bussiness_type_amount, accountInfo } = this.props;
    const {
      carVal,
      driverLists,
      typeIndex,
      curAccount,
      limitTime,
      limitAmount,
      isLimit
    } = this.state;
    let bizType = get(bussiness_type_amount, "type"); //业务类型

    let driverIds = [];
    driverLists.map(driverList => {
      driverIds.push(get(driverList, "key"));
    });
    let cardType = openCardSubTips({
      bizType,
      accountInfo,
      typeIndex,
      amount,
      truckName
    });

    if (cardType) {
      let params = {
        isLimit,
        amount,
        bizType,
        cardType,
        driverIds,
        limitTime,
        limitAmount,
        curAccount,
        remark
      };

      if (!carVal) {
        this.reallyOpenCard(params);
        return;
      }
      this.props
        .getCarList({
          carNumber: carVal,
          ...this.carSearchDefaultCondition,
          carNumberSearchType: 2 //1.模糊搜索 2.精确搜索
        })
        .then(result => {
          //是否是新车
          let carRes = get(result, ["res", "list"], []);
          if (carRes.length) {
            this.reallyOpenCard({
              ...params,
              carNumberId: carRes[0]["carNumberId"]
            });
          } else {
            Taro.showModal({
              title: "这是一辆新车！",
              content: "是否保存至当前公司的车辆列表中！",
              cancelText: "不保存",
              confirmText: "保存",
              success: res => {
                if (res.confirm) {
                  this.addCar({ carNumber: truckName, type: cardType }, params);
                }
              }
            });
          }
        })
        .catch(err => {
          //车牌id未取到
          console.log(err);
          this.reallyOpenCard(params);
        });
    }
  };
  addCar = ({ carNumber, type }, res) => {
    let carType = 1;
    if (type === 50) {
      carType = 3;
    }
    showLoading();
    this.props
      .createCar({ isMIniApp: 1, carNumber, status: 1, carType })
      .then(() => {
        hideLoading();
      })
      .catch(err => {
        hideLoading();
        console.log(err);
      });
  };
  chooseCurrent = carInfo => {
    //当前选中车牌
    this.setState({
      carVal: get(carInfo, "carNumber"),
      showCarList: false
    });
  };
  carChange = event => {
    const carVal = get(event, ["detail", "value"]);
    this.setState({
      carVal,
      carLists: [],
      showCarList: carVal ? true : false
    });
    if (carVal) {
      this.props
        .getCarList({
          carNumber: carVal,
          ...this.carSearchDefaultCondition
        })
        .then(result => {
          this.setState({
            carLists: get(result, ["res", "list"])
          });
        });
    }
  };

  onLimitChange = (type, value) => {
    this.setState({
      [`${type}`]: value
    });
  };

  onRemoveThis = () => {
    this.setState({
      showCarList: false
    });
  };
  remarkChange = event => {
    let remarkVal = get(event, ["detail", "value"], "");

    this.setState({
      remarkVal
    });
  };
  clearRemark = () => {
    this.setState({
      remarkVal: ""
    });
  };
  render() {
    const {
      cardTypes,
      typeIndex,
      isOpening,
      showCarList,
      carVal,
      driverLists,
      carLists,
      remarkVal
    } = this.state;
    const { accountInfo } = this.props;
    return (
      <View className="open-card">
        <View className="form-list">
          <Form onSubmit={this.openCard} reportSubmit={true} className="form">
            <View className="form-item">
              <Label className="tit">油卡类型</Label>
              <Picker
                name="cardType"
                className={typeIndex === "0" ? "picker-box gary" : "picker-box"}
                onChange={this.bindPickerChange}
                value={typeIndex}
                range={cardTypes}
                rangeKey="name"
              >
                <View className="picker">
                  {cardTypes[typeIndex].name}
                </View>
                <Image src={arrow_bottom} className="picker-icon" />
              </Picker>
            </View>

            <View className="form-item">
              <Label className="tit">绑定车辆</Label>
              <Input
                maxLength="8"
                name="truckName"
                onInput={this.carChange}
                // onFocus={this.carChange}
                value={carVal}
                placeholder="选填，请输入车牌号"
                className="input-box"
                placeholderClass="gary"
              />
              {showCarList &&
                carLists.length > 0 &&
                <SelectList
                  onRemoveThis={this.onRemoveThis}
                  lists={carLists}
                  onChooseCurrent={this.chooseCurrent}
                />}
            </View>
            <Driver
              showUnBind={true}
              driverLists={driverLists}
              className="card-driver"
              onShowBindModal={this.showBindModal}
              onShowModal={this.goCreateDriver}
              btnIndex={1}
            />
            {typeIndex !== "2" &&
              <View className="form-item">
                <Label className="tit">充值金额</Label>
                <Input
                  type="digit"
                  name="amount"
                  placeholder={`最多可充值${numeral(
                    get(accountInfo, "accountAmount")
                  ).format("0.00")}元`}
                  className="input-box"
                  placeholderClass="gary"
                />
              </View>}
            {typeIndex !== "2" &&
              <View className="remark-box">
                <Input
                  name="remark"
                  className="remark-input"
                  placeholderClass="gary"
                  placeholder="添加备注（30字以内）"
                  maxLength="30"
                  value={remarkVal}
                  onInput={this.remarkChange.bind(this)}
                />
                {remarkVal &&
                  <View className="clear-box" onTap={this.clearRemark}>
                    <Image src={clear_icon} className="clear-icon" />
                  </View>}
              </View>}

            {typeIndex === "2" &&
              <ShareSet
                onLimitChange={this.onLimitChange.bind(this, "isLimit")}
                onLimitTimeChange={this.onLimitChange.bind(this, "limitTime")}
                onShareAccount={this.onLimitChange.bind(this, "curAccount")}
                onLimitAmount={this.onLimitChange.bind(this, "limitAmount")}
              />}
            <View className="open-btn-box">
              <Button
                className="open-btn"
                formType="submit"
                disabled={isOpening}
              >
                立即开卡
              </Button>
            </View>
          </Form>
        </View>
      </View>
    );
  }
}
OpenComp.propTypes = {
  accountInfo: PropTypes.object
};
function mapStateToProps({ open, account }) {
  return {
    ...account,
    ...open
  };
}
export default connect(mapStateToProps, {
  ...mapDispatchToProps,
  ...mapAccountDispatchToProps
})(OpenComp);
