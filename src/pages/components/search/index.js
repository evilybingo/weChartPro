import Taro, { Component } from "@tarojs/taro";
import { View, Input } from "@tarojs/components";
import { get } from "lodash";

import SearchIcon from "../assets/search.png";
import ClearIcon from "../assets/clear.png";
import "./index.scss";
export default class SearchComponent extends Component {
  static defaultProps = {
    value: "",
    focus: false,
    isDisabled: true,
    // onInput: () => {},
    // onFocus: () => {},
    // onBlur: () => {},
    onSearch: () => {}
    // onClear: () => {}
  };

  handleClick() {
    const { isDisabled } = this.props;
    if (isDisabled) {
      Taro.navigateTo({
        url: "/pages/oil-card-search/oil-card-search"
      });
    }
  }

  handleInput(e) {
    this.props.onInputHandler(get(e, ["detail", "value"]));
  }

  handleClear() {
    this.props.onInputHandler("");
  }

  render() {
    const { value, isDisabled, focus, onSearch } = this.props;
    // console.log(this.props,'props')
    return (
      <View className="com-search">
        <View className="com-search__input">
          <Image src={SearchIcon} className="com-search__input-icon" />
          <Input
            className="com-search__input-input"
            onInput={this.handleInput.bind(this)}
            onFocus={this.handleInput.bind(this)}
            onClick={this.handleClick.bind(this)}
            focus={focus}
            disabled={isDisabled}
            value={value}
            placeholder="输入车牌号、司机手机号、姓名或卡号"
            placeholderClass="com-search__placeholder"
            confirmType="search"
            onConfirm={onSearch}
          />

          {!!value &&
            <View
              className="com-search__input-clear"
              onClick={this.handleClear}
            >
              <Image src={ClearIcon} className="com-search__input-clear-icon" />
            </View>}
        </View>
        {!isDisabled &&
          <View className="com-search__btn" onClick={onSearch}>
            搜索
          </View>}
      </View>
    );
  }
}
