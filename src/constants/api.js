
/**
 * HOST 在config文件夹中配置
 */
export const DEMO_API=`${HOST}/facilitator/mp/queryCondition`
export const LOGIN_GET_TOKEN=`${HOST}/bms/login/minilogin`//登录
export const GET_AUTH=`${HOST}/bms/application/getAuth`//获取用户权限
export const OIL_CARD_DETAIL=`${HOST}/bms/oilAccount/oilCardInfo`//获取油卡详情
export const CARD_BIND_DRIVER=`${HOST}/bms/oilAccount/cardBindInfo`//获取油卡司机绑定详情
export const CREATE_DRIVER=`${HOST}/bms/driver/addDriver`//司机新增
export const SET_BIND_DRIVER=`${HOST}/bms/oilAccount/setBindDriver`//绑定/解绑司机
export const GET_SHARE_ACCOUNT=`${HOST}/bms/oilAccount/shareAccount`//获取可共享账户
export const GET_MAX_AMOUNT=`${HOST}/bms/oilAccount/bizType`//开卡 获取最多可充值金额
export const DRIVER_LIST=`${HOST}/bms/driver/getDriverList`//开卡 司机列表
export const API_OIL_CARD_LIST = `${HOST}/bms/oilAccount/oilCardList` // 油卡列表
export const API_OIL_CARD_RECHARGE = `${HOST}/bms/oilAccount/OADistribute` // 油卡充值 

export const DRIVER_LIST_API=`${HOST}/bms/driver/getDriverList`//开卡 司机列表
export const CURRENT_OIL_ACCOUNT_INFO=`${HOST}/bms/oilAccount/getOilAccountInfo`//帐户-获取油卡账户详情
export const BIZ_TYPE_API=`${HOST}/bms/oilAccount/bizType`//获取业务类型-账户余额
export const GET_USER_INFO=`${HOST}/bms/user/getUserInfo`//用户-用户详情接口
export const GET_CAR_LIST=`${HOST}/bms/car/getCarList`//车辆列表
export const CREATE_CARD=`${HOST}/bms/oilAccount/createCard`//开卡
export const SET_OIL_CARD_STATUS=`${HOST}/bms/oilAccount/setCardStatus`//设置油卡状态
export const GET_PROVINCE_NAME=`${HOST}/bms/common/getProvinceShortName`//获取各地省简称
export const CREATE_CAR_API=`${HOST}/bms/car/addCar`//添加车牌
export const GET_LIST_NULL_FALG=`${HOST}/bms/oilAccount/getMiniCardTab`//添加车牌
