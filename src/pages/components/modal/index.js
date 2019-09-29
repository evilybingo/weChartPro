import Taro, { Component } from "@tarojs/taro";
import { View, Input, Button, Form, Textarea } from "@tarojs/components";
import { get, isFunction } from "lodash";
import PropTypes from "prop-types";
import numeral from "numeral";
import { connect } from "@tarojs/redux";
import AccountActions from "@actions/account";
import OilCardActions from "@actions/oilCard";

import "./index.scss";

@connect(
  ({ oilCard, account }) => ({
    ...oilCard,
    ...account
  }),
  { ...AccountActions, ...OilCardActions }
)
export default class ModalComponent extends Component {
  static defaultProps = {
    isShow: false,
    aoId: 0,
    amount: "",
    getBalance: false,
    loading: false,
    onClose: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: "",
      remark: "",
      animationData: null,
      priceError: false,
      errorText: "金额不正确"
    };
    this.current_aoId = 0;
  }

  remarkChange(event) {
    this.setState({
      remark: get(event, ["detail", "value"], "")
    });
  }
  getInfo = () => {
    const { isShow, aoId } = this.props;
    if (isShow && aoId != this.current_aoId) {
      this.current_aoId = aoId;

      this.props.getOilCardDetail({ aoId }).then(() => {
        this.setState({
          getBalance: true
        });
      });
      this.props.getAccountInfo();
    }
  };

  componentWillMount() {
    this.getInfo();
  }
  handleClose=()=> {
    if (isFunction(this.props.onClose)) {
      this.props.onClose(false);
    }
  }
  // 取消操作 与 空白区域点击
  cancel=(e)=> {
    e.stopPropagation();
    e.preventDefault();
    this.handleClose();
  }

  priceCheck=(price)=> {
    const { accountInfo: { accountAmount } } = this.props;
    let hasError = false,
      errorText = "";
    // const
    if (price) {
      const money = /^\d+(.\d{1,2})?$/;
      if (!money.test(price)) {
        (hasError = true), (errorText = ` 充值金额最多可输入2位小数`);
      } else if (price <= 0 || price - accountAmount > 0) {
        (hasError = true), (errorText = `金额必须大于0且小于等于${accountAmount}`);
      } else {
        hasError = false;
        errorText = "";
      }
    } else {
      (hasError = true), (errorText = `请输入充值金额`);
    }
    this.setState({
      priceError: hasError,
      errorText
    });
    return hasError;
  }

  submitForm=(e)=> {
    console.log(e);
    const { aoId } = this.props;
    const { amount, remark } = this.state;
    if (this.priceCheck(amount)) return;

    Taro.showLoading();
    // grantType 1 分公司， 3 油卡，
    this.setState({
      isRecharge: true
    });
    this.props
      .postOilCardRecharge({
        formId: e.detail.formId,
        grantType: 3,
        data: [{ no: aoId, obj: aoId, amount, remark }]
      })
      .then(result => {
        console.log(result, "充值");
        const { err, res: { error = [] } } = result;
        this.setState({
          isRecharge: false
        });
        if (err == 0 && !error.length) {
          Taro.showToast({
            title: "充值成功！"
          });
          this.props.onClose(true);
        } else if (err == 0 && error.length != 0) {
          const { msg } = error[0];
          Taro.showToast({
            title: msg || "充值失败",
            icon: "none"
          });
        }
      })
      .catch(err => {
        console.log(err, "error");
        this.setState({
          isRecharge: false
        });
        this.handleClose();
        Taro.showToast({
          title: err.msg || "充值失败",
          icon: "none"
        });
      });
  }

  handleInput=(e)=> {
    const amount = e.detail.value || "";
    this.setState({
      amount
    });
    this.priceCheck(amount);
  }

  render() {
    const {
      animationData,
      priceError,
      errorText,
      getBalance,
      isRecharge,
      remark
    } = this.state;
    const { isShow } = this.props;
    const {
      oilCardDetail = { balance: "0.00" },
      accountInfo = { accountAmount: "0.00" }
    } = this.props;

    return (
      <View className="com-modal" hidden={!isShow}>
        <View className="com-modal__mask" />
        <Form
          className="com-modal__box"
          animation={animationData}
          reportSubmit={true}
          onSubmit={this.submitForm}
        >
          <View className="com-modal__box-title">请输入充值金额</View>
          <View className="com-modal__box-body">
            <View className="com-modal__box-body__desc">账户可分配余额</View>
            <View className="com-modal__box-body__text">
              <Text className="unit">￥</Text>
              {numeral(accountInfo.accountAmount).format("0,0.00")}
            </View>
            <Input
              placeholderClass="com-modal__gary"
              className={`com-modal__box-body__input ${priceError
                ? "with-error"
                : ""}`}
              type="digit"
              placeholder={
                getBalance
                  ? `油卡余额：${numeral(oilCardDetail.balance).format("0,0.00")} 元`
                  : ""
              }
              onInput={this.handleInput}
            />
            {priceError &&
              <View className="com-modal__box-body__input-error">
                {errorText}
              </View>}

            <View className="com-modal__box-body__area">
              {/*  */}
              <Textarea
                placeholder="添加备注（可不填）"
                className="area-box"
                placeholderClass="gray"
                fixed={true}
                count={true}
                maxlength={30}
                value={remark}
                onInput={this.remarkChange.bind(this)}
              />
             <View className="count-box">
               {remark.length?remark.length:0}/30
             </View>
            </View>
          </View>
          <View className="com-modal__box-footer">
            <Button
              className="com-modal__box-footer__btn"
              onClick={this.cancel}
            >
              取消
            </Button>
            <Button
              className="com-modal__box-footer__btn primary-button"
              formType="submit"
              disabled={isRecharge}
            >
              充值
            </Button>
          </View>
        </Form>
      </View>
    );
  }
}

ModalComponent.propTypes = {
  aoId: PropTypes.number,
  amount: PropTypes.string,
  isShow: PropTypes.bool
};
