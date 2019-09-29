import Taro from "@tarojs/taro";
import { View, Label, Input, Button } from "@tarojs/components";
import { AtModal } from "taro-ui";
import { connect } from "@tarojs/redux";
import mapDispatchToProps from "@actions/driver";
import mapDetailDispatchToProps from "@actions/oilDetail";
import mapAccountDispatchToProps from "@actions/account";
import SelectList from "../card/components/selectList";
import { setDriverInfo, getDriverInfo } from "@utils/storage";
import "./create.scss";
import { get,isArray } from "lodash";


class CreateDriver extends Taro.Component {
  config = {
    navigationBarTitleText: "添加司机",
    driverInfo: {},
    show: false,
    btnDisabled: false
  };
  state = {
    isOpened: false,
    drivers: [],
    newDriver: {}
  };
  componentWillMount() {
    const { aoId } = this.$router.params;
    if (aoId) this.props.bindDriverList({ aoId, status: 1 });
    this.props.getAccountInfo();
  }
  handleConfirm = () => {
    const { newDriver } = this.state;
    this.setState({
      isOpened: false
    });
    this.bindDriver(newDriver);
  };
  getDriverName = event => {
    let employeeMobileName = get(event, ["detail", "value"]);
    const { branchId, aoId } = this.$router.params;
    this.setState({
      employeeName: employeeMobileName,
      show: employeeMobileName ? true : false,
      drivers: []
    });
    let payload = {
      employeeName: employeeMobileName,
      orderType: 1,
      isOwn: 1,
      status: 1
    };
    if (branchId)
      payload = {
        ...payload,
        branchId: parseInt(branchId)
      };
    if (aoId)
      payload = {
        ...payload,
        aoId: parseInt(aoId)
      };
    if (employeeMobileName)
      //仅需要当前账号下的 1是
      this.props
        .driverList({
          payload
        })
        .then(result => {
          this.setState({
            drivers: get(result, ["res", "list"], [])
          });
        });
  };
  getPhone = event => {
    this.setState({
      employeeMobile: get(event, ["detail", "value"])
    });
  };

  bindDriver = driverInfo => {
    const { aoId = 28477, isCreate, branchId } = this.$router.params;
    const { bindDrivers = [], unBindDriver } = this.props;
    console.log(bindDrivers);
    let drivers =
      get(driverInfo, "employeeName") + "-" + get(driverInfo, "employeeMobile");

    let driverList = getDriverInfo();
    driverList=driverList&&isArray(driverList) ?driverList : [];
    if (isCreate) {
      //从详情跳转过来的
      driverList = bindDrivers;
    }
    let newList = driverList.filter(
      lt => lt.key === get(driverInfo, "employeeId")
    );
    if (newList.length) {
      Taro.showToast({
        title: "不能绑定重复的司机！",
        icon: "none",
        mask: true
      });
      return;
    }
    let payload = {
      aoId,
      bindStatus: 1,
      driverIds: [get(driverInfo, "employeeId")]
    };
    // if (branchId) {
    //   payload = {
    //     ...payload,
    //     branchId
    //   };
    // }
    if (aoId && isCreate) {
      //油卡详情 绑定司机
      unBindDriver({
        payload,
        cb: res => {
          this.setState({
            btnDisabled: false
          });
          if (res.err === 0) {
            const pages = getCurrentPages();
            const prePage = pages[pages.length - 2];
            prePage.options = { refresh: true };
            Taro.navigateBack();
          }
        }
      }).catch(() => {
        this.setState({
          btnDisabled: false
        });
      });
      return;
    }
    setDriverInfo({
      //开卡 的绑定司机
      driverId: get(driverInfo, "employeeId"),
      drivers
    });
    Taro.navigateBack();
  };

  add = event => {
    const { name, mobile } = get(event, ["detail", "value"], {});
    const { branchId } = this.$router.params;

    if (!name) {
      Taro.showToast({ title: "请输入司机姓名", icon: "none", mask: true });
      return;
    }
    if (!mobile) {
      Taro.showToast({ title: "请输入手机号", icon: "none", mask: true });
      return;
    }
    this.setState({
      btnDisabled: true
    });
    let listParams = {
      employeeMobile: mobile
    };
    if (branchId) {
      listParams = {
        ...listParams,
        branchId: parseInt(branchId)
      };
    }
    this.props
      .driverList({
        payload: listParams
      })
      .then(result => {
        // 根据输入手机号查询司机列表，列表过滤取出手机号完全相同的一组数据

        let lists = get(result, ["res", "list"]);
        let newLists = [];
        if (lists.length) {
          newLists = lists.filter(list => list.employeeMobile === mobile);
        }

        if (newLists.length) {
          //若有数据，则直接绑定
          this.setState({
            btnDisabled: false
          });
          this.bindDriver(newLists[0]);
        } else {
          //若无，则添加司机再绑定
          const { accountInfo } = this.props;
          let params = {
            employeeName: name,
            employeeMobile: mobile,
            status: 1
          };
          if (get(accountInfo, "companyType") === 2) {
            params = {
              ...params,
              companyId: get(accountInfo, "belongCompanyId")
            };
          }
          if (branchId) {
            params = {
              ...params,
              companyId: branchId
            };
          }
          this.props
            .createDriver(params)
            .then(result => {
              this.setState({
                btnDisabled: false
              });
              if (get(result, "err") === 0) {
                this.setState({
                  isOpened: true,
                  newDriver: get(result, "res")
                });
              }
            })
            .catch(() => {
              this.setState({
                btnDisabled: false
              });
            });
        }
      });
  };
  chooseCurrent = driverInfo => {
    this.setState({
      driverInfo,
      show: false
    });
  };
  cancel = () => {
    Taro.navigateBack();
  };
  onRemoveThis = () => {
    this.setState({
      show: false
    });
  };
  render() {
    const { drivers, show, driverInfo, btnDisabled,isOpened  } = this.state;

    return (
      <View className="create-driver">
        <Form onSubmit={this.add} reportSubmit={true}>
          <View className="input-box">
            <Label className="tit">司机姓名</Label>
            <Input
              name="name"
              className="input-item"
              placeholder="请输入司机姓名"
              value={get(driverInfo, "employeeName")}
              placeholderClass="gray"
              maxLength="20"
              onInput={this.getDriverName}
              //  onFocus={this.getDriverName}
            />
            {drivers.length > 0 &&
              show &&
              <SelectList
                onRemoveThis={this.onRemoveThis}
                lists={drivers}
                onChooseCurrent={this.chooseCurrent}
              />}
          </View>
          <View className="input-box">
            <Label className="tit">手机号码</Label>
            <Input
              name="mobile"
              onInput={this.getPhone}
              className="input-item"
              type="number"
              value={get(driverInfo, "employeeMobile")}
              placeholder="请输入司机手机号码"
              placeholderClass="gray"
              maxLength="11"
            />
          </View>
          <View className="btn-list">
            <Button
              className="cancel-btn"
              hoverClass="none"
              onClick={this.cancel}
            >
              取消
            </Button>
            <Button
              className="add-btn"
              hoverClass="none"
              form-type="submit"
              disabled={btnDisabled}
            >
              添加
            </Button>
          </View>
        </Form>
        <AtModal
          isOpened={isOpened}
          title=""
          content=""
          confirmText="知道了"
          onConfirm={this.handleConfirm}
        />
        <AtModal isOpened={isOpened}>
          <AtModalContent>
            <View className="modal-title">这是一位新司机！</View>
            <View className="modal-content">将为您保存至当前公司的司机列表中！</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleConfirm} className="know-btn">
              知道了
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}
function mapStateToProps({ driver, oilDetail, account }) {
  return { ...oilDetail, ...driver, ...account };
}

export default connect(mapStateToProps, {
  ...mapDispatchToProps,
  ...mapDetailDispatchToProps,
  ...mapAccountDispatchToProps
})(CreateDriver);
