import Taro from "@tarojs/taro";
import { View, Button, Image, Label, Input, Form } from "@tarojs/components";
import PropTypes from "prop-types";
import { setToken, setMiniVersion } from "@utils/storage";
import { connect } from "@tarojs/redux";
import logo from "@images/logo.png";
import close_eye from "@images/icons/close_eye.png";
import open_eye from "@images/icons/open_eye.png";
import { errorTips, valCheck } from "./config";
import mapDispatchToProps from "@actions/login";
import { get, trim } from "lodash";
import "./login.scss";
class Login extends Taro.Component {
  config = {
    navigationBarTitleText: "企业账号登录"
  };
  state = {
    eyeOpen: false,
    isLogining: false,
    tipsNum: 12,
    pattern: /^[A-Za-z0-9]+$/
  };
  componentWillMount() {}

  login = event => {
    const { pattern } = this.state;
    const { username, password } = get(event, ["detail", "value"], {});
    let num = valCheck({
      pattern,
      event,
      username: trim(username),
      password: trim(password)
    });

    this.setState({
      tipsNum: num,
      nameVal: trim(username),
      passwordVal: trim(password)
    });

    const { login } = this.props;

    if (num === 0) {
      Taro.showLoading({
        title: "登录中",
        mask: true
      });
      this.setState({
        isLogining: true
      });
      const _this = this;
      Taro.login({
        success(res) {
          if (res.code) {
            login({
              payload: { username: trim(username), pwd: trim(password) } //, code: res.code
            })
              .then(result => {
                _this.setState({
                  isLogining: false
                });
                Taro.hideLoading();
                if (get(result, "err") === 0) {
                  setToken(get(result, ["res", "accessToken"]));
                  setMiniVersion(get(result, ["res", "miniversion"]));
                  Taro.showToast({
                    icon: "none",
                    title: errorTips[0],
                    duration: 2000,
                    complete: () => {
                      Taro.reLaunch({ url: "../index/index" });
                    }
                  });
                }
              })
              .catch(() => {
                _this.setState({
                  isLogining: false
                });
              });
          }
        }
      });
    }
  };
  openEye = () => {
    const { passwordVal, eyeOpen } = this.state;
    this.setState({
      passwordVal,
      eyeOpen: !eyeOpen
    });
  };
  valideRule = ({ defineNum, event }) => {
    const { tipsNum, pattern } = this.state;
    const val = get(event, ["detail", "value"]);
    if (
      (val && tipsNum === defineNum) ||
      (!pattern.test(val) && tipsNum === 7)
    ) {
      this.setState({
        tipsNum: 12
      });
    }
  };
  nameInput = event => {
    this.valideRule({
      defineNum: 5,
      event,
      nameVal: get(event, ["detail", "value"])
    });
  };
  passwordInput = event => {
    this.setState({
      passwordVal: get(event, ["detail", "value"])
    });

    this.valideRule({
      defineNum: 6,
      event
    });
  };
  render() {
    const { tipsNum, passwordVal, nameVal } = this.state;
    return (
      <View>
        <View className="login-bg" />
        <View className="login-wrapper">
          <View className="logo-box">
            <Image src={logo} className="logo" />
            <Label className="title">老吕加油企业版</Label>
          </View>

          <Form onSubmit={this.login} reportSubmit={true} className="form">
            <View className="form-box">
              <View className="item">
                <Input
                  onInput={this.nameInput}
                  name="username"
                  className="input-box"
                  placeholderClass="gray"
                  placeholder="请输入用户名"
                  maxLength="50"
                  value={nameVal}
                />
              </View>
              {eyeOpen
                ? <View className="item">
                    <Input
                      onInput={this.passwordInput}
                      name="password"
                      className="input-box password-box"
                      placeholderClass="gray"
                      placeholder="请输入密码"
                      maxLength="50"
                      value={passwordVal}
                    />
                    <View className="eye-box" onTap={this.openEye}>
                      <Image className="eye-icon open-eye" src={open_eye} />
                    </View>
                  </View>
                : <View className="item">
                    <Input
                      onInput={this.passwordInput}
                      name="password"
                      type="password"
                      className="input-box password-box"
                      placeholderClass="gray"
                      placeholder="请输入密码"
                      maxLength="50"
                      value={passwordVal}
                    />
                    <View className="eye-box" onTap={this.openEye}>
                      <Image className="eye-icon close-eye" src={close_eye} />
                    </View>
                  </View>}
            </View>
            <View className="error-tip">
              {tipsNum !== 0 ? get(errorTips, tipsNum, "") : ""}
            </View>
            <View className="login-btn-box">
              <Button
                disabled={isLogining}
                form-type="submit"
                className={`login-btn ${isLogining ? "" : "blue"}`}
              >
                登录
              </Button>
            </View>
          </Form>
        </View>
      </View>
    );
  }
}
function mapStateToProps({ login }) {
  return login;
}
Login.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
