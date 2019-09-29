import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { getWxInfo, clearAllStorage, clearDriverInfo } from "@utils/storage";
import { showLoading, hideLoading } from "@utils/loading";
import "./index.scss";
import mapDispatchToProps from "@actions/account";
import head_photo from "@images/head_photo.png";
import manage_bg from "@images/manage_bg.png";
import { list } from "./config";
import { get } from "lodash";
import numeral from "numeral";

class Index extends Component {
  config = {
    navigationBarTitleText: "老吕加油企业版",
    enablePullDownRefresh: true
  };
  state = {
    show: false,
    menuList: []
  };
  setMenu = showList => {
    let menuList = list.filter(menu => showList[menu.className] && menu);
    this.setState({
      menuList
    });
  };
  getAUthHandler = callback => {
    showLoading({ title: "" });
    let showList = {
      "contact-service": true,
      "out-login": true
    };
    this.setMenu(showList);
    this.props
      .getAuth()
      .then(result => {
        hideLoading();
        showList = {
          "open-card": get(result, ["res", "createCard", "isAuth"]) === 1,
          "oil-manage": get(result, ["res", "manageOilCard", "isAuth"]) === 1,
          "contact-service": true,
          "out-login": true
        };
        this.setMenu(showList);
        callback && callback();
      })
      .catch(() => {
        callback && callback();
        hideLoading();
      }); //权限
  };
  componentWillMount() {
    this.props.getAccountInfo(); //获取油卡账户详情
    this.props.getUserInfo(); //用户详情接口
    this.getAUthHandler();
  }
  getAccount = callback => {
    this.props
      .getAccountInfo()
      .then(() => {
        callback && callback();
      })
      .catch(() => {
        callback && callback();
      });
  };
  onPullDownRefresh() {
    this.getAUthHandler(Taro.stopPullDownRefresh);
    this.getAccount(Taro.stopPullDownRefresh);
  }
  componentWillUnmount() {}

  componentDidHide() {}
  outLogin = () => {
    clearAllStorage();
    wx.reLaunch({
      url: "../login/login"
    });
  };
  authControlMenu = ({ name, className, url }) => {
    this.props.getAuth().then(result => {
      //  this.authControlMenu({result,name:'createCard',className:'open-card'})
      if (get(result, ["res", name, "isAuth"]) === 1) {
        Taro.navigateTo({ url });
      } else if (get(result, ["res", name, "isAuth"]) === 0) {
        Taro.showModal({
          content: "您的账号未开通该权限，请联系企业管理员为您开通！",
          showCancel: false,
          confirmText: "知道了"
        });
        let menuList = this.state.menuList.filter(
          m => m.className !== className
        );
        this.setState({
          menuList
        });
      }
    });
  };
  goPage(className, url) {
    const { getAuth } = this.props;

    //phoneNumber:'18356086105'
    if (className) {
      switch (className) {
        case "open-card":
          this.authControlMenu({
            name: "createCard",
            className: "open-card",
            url
          });
          return;
        case "oil-manage":
          clearDriverInfo();
          this.authControlMenu({
            name: "manageOilCard",
            className: "oil-manage",
            url
          });
          return;
        case "contact-service":
          wx.showModal({
            title: "拨打电话",
            content: "400 900 1211",
            confirmText: "拨打",
            success(res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: "4009001211"
                });
              }
            }
          });
          return;
        case "out-login":
          wx.showModal({
            content: "您确定退出当前的账号吗？",
            success: res => {
              if (res.confirm) {
                this.outLogin();
              }
            }
          });
          return;
        default:
          Taro.navigateTo({ url });
      }
    }
  }
  render() {
    const { accountInfo, userInfo } = this.props;
    const wxInfo = getWxInfo();
    const { menuList } = this.state;
    return (
      <View className="index-wrapper">
        <Demo />
        <View className="head">
          <Image src={manage_bg} className="manage-bg" />
          <View className="head-box">
            <Image
              src={
                get(wxInfo, ["userInfo", "avatarUrl"])
                  ? get(wxInfo, ["userInfo", "avatarUrl"])
                  : head_photo
              }
              className="head-photo"
            />
            <View className="info">
              <View className="title">
                {get(userInfo, "userName")}
              </View>
              <View className="branch">
                {get(accountInfo, "companyType") === 1
                  ? "总公司"
                  : get(accountInfo, "belongCompany")}
              </View>
              <View className="company">
                {get(accountInfo, "parentCompany")}
              </View>
            </View>
          </View>
        </View>
        <View className="charge-balance">
          <View className="money">
            <Text className="unit">¥</Text>
            {numeral(get(accountInfo, "accountAmount")).format("0,0.00")}
          </View>
          <View className="name">账户可分配余额（元）</View>
        </View>
        <View className="menu-list">
          <View className="at-row at-row--wrap">
            {menuList.map((lt, index) => {
              return (
                <View
                  className={lt.className + " item at-col at-col-4"}
                  key={`${lt.className}-${index}`}
                  onTap={this.goPage.bind(this, lt.className, lt.url)}
                >
                  <Image src={lt.imgUrl} className={`img ${lt.className}`} />
                  <Label className="tit">
                    {lt.name}
                  </Label>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}
function mapStateToProps({ account }) {
  return account;
}
Index.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(Index);
