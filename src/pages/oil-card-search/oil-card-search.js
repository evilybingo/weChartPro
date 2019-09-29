import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";

import {
  SearchComponent,
  OilCardComponent,
  SelectComponent,
  NoOilCardComponent
} from "../components";
import { getWindowHeight } from "@utils/style";

import actions from "@actions/oilCard";
import { connect } from "@tarojs/redux";
import "./oil-card-search.scss";
import { isString } from "lodash";

const CONST_DATA = {
  pageSize: 10,
  actionType: 0,
  cardSource: 10,
  isMini:1
  // miniSearch
};
@connect(state => state.oilCard, actions)
export default class PageOilCardSearch extends Component {
  config = {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#001525",
    navigationBarTitleText: "老吕加油企业版",
    navigationBarTextStyle: "white",
    onReachBottomDistance: 30
  };
  constructor() {
    super(...arguments);
    this.state = {
      count: 0,
      data: [],
      hasMore: false,
      searchValue: "",
      scrollViewHeight: 200,
      page: 1,
      pageSize: 10,
      cardSort: 0,
      cardStatus: 0, // 油卡状态
      isFirst: true,
      loading: false,
      isCancel: false
    };
  }

  getPayload = () => {
    const { page, pageSize, searchValue, cardSort, cardStatus } = this.state;
    return {
      page,
      pageSize,
      miniSearch: searchValue,
      cardSort,
      cardStatus,
      ...CONST_DATA
    };
  };

  getList=(params) =>{
    Taro.showLoading({ mask: true });
    const payload = this.getPayload();
    this.props
      .getOilCardList({...payload,...params})
      .then(result => {
        let { err, res: { count, list } } = result;
        let { page, pageSize, data } = this.state;
        if (err === 0) {
          this.setState({
            data: data.concat(list),
            count,
            hasMore: page * pageSize < count,
            loading: false
          });
        }
      })
      .catch(err => {
        this.setState({
          loading: false
        });
      });
  }

  search=()=> {
    this.props.SetNullOilCardList(); //点击搜索，清空state存入的list
    this.setState({
      page: 1,
      isFirst: false,
      data: [],
      loading: true
    });
    this.getList();
  }

  handleLoadMore=()=> {
    const { listPage } = this.props;
    let {  hasMore } = this.state;
    if (hasMore) {
      this.setState({
        loading: true,
        page: listPage + 1
      });
      this.getList({ page: listPage + 1 });
    }
  }

  onReachBottom() {
    this.handleLoadMore();
  }

  componentDidMount() {
    this.setScrollViewHeight();
  }
  // scroll-view 高度
  setScrollViewHeight=() =>{
    const windowHeight = getWindowHeight();
    // 顶部固定区域 90PX
    this.setState({
      scrollViewHeight: windowHeight - 90
    });
  }

  componentDidShow() {
    if (this.state.searchValue && this.state.searchValue !== "") this.search();
  }

  // 搜索的下拉选项 强耦合组件SelectComponent传出的数据，别处慎用
  onSelectChange=(key, value)=> {
    this.setState(
      {
        [key]: value
      },
      this.search
    );
  }
  // 搜索的 input
  handleInput = searchValue => {
    //  已取得value值 不明原因得到的还是event
    //console.log(searchValue, "======");
    if (isString(searchValue))
      this.setState({
        searchValue
      });
  };

  cancelSelect=()=> {
    this.setState({
      isCancel: true
    });
  }

  refreshList=()=> {
    //充值后刷新 返回第一页
    this.setState(
      {
        loading: true,
        page: 1,
        data: []
      },
      () => {
        this.props.SetNullOilCardList(); //清空数据 刷出第一页
        this.getList();
      }
    );
  }
  componentDidHide() {
    this.setState({
      loading: true
    });
    this.props.SetNullOilCardList();
  }
  componentWillUnmount() {
    this.props.SetNullOilCardList();
  }
  render() {
    const {
      scrollViewHeight,
      searchValue,
      data,
      isFirst,
      hasMore,
      loading,
      isCancel
    } = this.state;
    const { cardInfo } = this.props;
    return (
      <View className="container oil-card-list">
        <View className="oil-card-list__search" onClick={this.cancelSelect}>
          <SearchComponent
            isDisabled={false}
            value={searchValue}
            onInputHandler={this.handleInput}
            onSearch={this.search}
          />
        </View>

        <View className="oil-card-list__tabs">
          <SelectComponent onChange={this.onSelectChange} isCancel={isCancel} />
        </View>
        {// 第一次进入页面不会触发搜索，so 页面是空白，不校验数据
        isFirst
          ? <View className="oil-card-list__scroll-view" />
          : // <ScrollView
            // 	scrollY
            // 	className='oil-card-list__scroll-view'
            // 	id='scrollView'
            // 	onScrollToLower={this.handleLoadMore}
            // 	lowerThreshold='30'
            // 	style={`height: ${scrollViewHeight}px` }
            // 	>
            <View
              className="oil-card-list__scroll-view"
              style={`height: ${scrollViewHeight}px`}
            >
              {cardInfo.length
                ? <OilCardComponent
                    list={cardInfo}
                    hasMore={hasMore}
                    loading={loading}
                    onConfirm={this.refreshList.bind(this)}
                  />
                : !loading && <NoOilCardComponent />}
            </View>
        // </ScrollView>
        }
      </View>
    );
  }
}
