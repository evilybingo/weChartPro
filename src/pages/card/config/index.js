import { get } from "lodash";
import numeral from "numeral";
import Taro from "@tarojs/taro";
import { limitUnitList,limitDetailUnitList } from "../../oil-card-detail/config";
import diesel_bg from "@images/diesel_bg.png"; //柴油
import freeze_diesel from "@images/freeze_diesel.png"; //柴油冻结
import gas_bg from "@images/gas_bg.png"; //汽油
import freeze_gas from "@images/freeze_gas.png"; //汽油冻结
import natural_gas from "@images/natural_gas.png"; //天然气
import freeze_natural from "@images/freeze_natural.png"; //天然气冻结
export const bgList = {
  0: "",
  101: diesel_bg,
  102: freeze_diesel,
  201: gas_bg,
  202: freeze_gas,
  301: natural_gas,
  302: freeze_natural
};
export const tabListOne = [
  //自有车共享卡
  { title: "已绑定司机" },
  { title: "共享限额" }
];
export const tabListTwo = [
  //自有车充值卡 或 外请车结算卡
  { title: "已绑定司机" }
];

export const cardTypeList = [
  { value: 0, name: "请选择油卡类型" },
  { value: 10, name: "自有车充值卡" },
  { value: 20, name: "自有车共享卡" },
  { value: 50, name: "外请车结算卡" }
];
export const limitCondition = [
  {
    name: "按交易总金额（单位：元）",
    value: 1
  }
];
export const limitInitList = [
  {
    name: "请选择",
    value: 0
  },
  {
    name: "每次",
    value: 11
  },
  {
    name: "每天",
    value: 12
  },
  {
    name: "每周",
    value: 13
  },
  {
    name: "每月",
    value: 14
  }
];

export const createCardTips = {
  1: "请选择油卡类型",
  2: "请输入充值金额",
  3: "充值金额输入数字，限制两位小数",
  4: "请输入限制额度",
  5: "限制额度输入数字，限制两位小数",
  6: "请设置共享额度",
  7: "未获取到业务类型",
  8: "油卡绑定人数已达上限！"
};
export function openCardSubTips({
  accountInfo,
  typeIndex,
  amount,
  truckName,
  bizType
}) {
  let cardType = 0;
  let maxAmount = numeral(get(accountInfo, "accountAmount")).format("0.00");
  cardTypeList.map((lt, key) => {
    if (key === Number(typeIndex)) {
      cardType = lt.value;
    }
  });
  let title;
  if (!bizType) {
    title = createCardTips[7];
  } else if (cardType === 0) {
    title = createCardTips[1];
  } else if (!amount && typeIndex !== "2") {
    title = createCardTips[2];
  } else if (amount && !numValidate.test(amount)) {
    title = createCardTips[3];
  } else if (
    Number(numeral(amount).format("0.00")) > Number(maxAmount) &&
    typeIndex !== "2"
  ) {
    title = `最多可充值${maxAmount}元`;
  } else if (
    (truckName && !/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(truckName)) ||
    (truckName.length < 7 && truckName.length > 0)
  ) {
    //只能输入包含（中文，数字，英文）
    title = "请输入正确的车牌号";
  }
  if (title) {
    Taro.showToast({
      title,
      icon: "none",
      mask: true
    });
    return;
  }
  return cardType;
}
const numValidate = /^\d+(.\d{1,2})?$/;
export function openPattern({
  amount,
  bizType,
  cardType,
  driverIds,
  carNumberId,
  limitTime,
  limitAmount,
  curAccount,
  isLimit,
  remark
}) {
  let payload = {
    bizType,
    cardType,
    driverIds,
    truckId: carNumberId
  };
  let lens = driverIds && driverIds.length;
  let cardTypeNum = cardType === 10 || cardType === 20;
  let title;
  if (cardType === 50 && lens > 1) {
    title = createCardTips[8];
  } else if (cardTypeNum && lens > 15) {
    title = createCardTips[8];
  }

  if (cardType === 10 || cardType === 50) {
    //自有车充值卡 外请车充值卡
    payload = {
      ...payload,
      amount,
      remark,
      sharedAoId: 0
    };
  } else if (cardType === 20) {
    //自有车共享卡
    payload = {
      ...payload,
      sharedAoId: get(curAccount, "aoId")
    };
    if (isLimit === 1) {
      if (!get(limitTime, "value")) {
        title = createCardTips[6];
      } else if (!limitAmount) {
        title = createCardTips[4];
      } else if (limitAmount && !numValidate.test(limitAmount)) {
        title = createCardTips[5];
      }

      payload = {
        ...payload,
        limitBox: [
          {
            limitType: 1,
            limitKey: get(limitTime, "value"),
            limitValue: limitAmount
          }
        ]
      };
    }
  } else {
    return;
  }
  if (title) {
    Taro.showToast({
      title,
      icon: "none",
      mask: true
    });
    return;
  }
  return payload;
}
export const defaultState = {
  remarkVal:'',
  isOpening:false,
  carLists: [],
  haveCar: false,
  show: false,
  showUnbindIndex: 2,
  typeIndex: "0",
  cardTypes: cardTypeList,
  driverLists: [],
  carVal: "",
  isLimit: 1,
  showCarList: false
};

export function sumHandler(oilDetail) {
  let sum = " ¥" + numeral(get(oilDetail, "balance")).format("0.00");
  if (get(oilDetail, "cardType") === 20) {
    if (get(oilDetail, "limitBox", []).length) {
      let limitVal = get(oilDetail, "limitBox")[0];
      if (limitVal) {
        sum =
          " ¥" +
          limitVal["limitValue"] +
          "/" +
          limitUnitList[limitVal["limitKey"]];
      } else {
        sum = "不限制";
      }
    } else {
      sum = "不限制";
    }
  }
  return sum;
}
export function sumLimitUnitHandler(oilDetail) {
  let sum = " ¥" + numeral(get(oilDetail, "balance")).format("0.00");
  let tit = "限制额度";
  if (get(oilDetail, "cardType") === 20) {
    if (get(oilDetail, "limitBox", []).length) {
      let limitVal = get(oilDetail, "limitBox")[0];
      if (limitVal) {
        sum = " ¥" + limitVal["limitAddOil"];
        tit = `${limitDetailUnitList[limitVal["limitKey"]]}可用`;
      } else {
        sum = "不限制";
      }
    } else {
      sum = "不限制";
    }
  }
  return { tit, sum };
}
