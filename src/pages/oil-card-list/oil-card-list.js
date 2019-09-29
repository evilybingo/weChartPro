import Taro, { Component, getCurrentPages } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtTabs, AtTabsPane } from "taro-ui";
import actions from "@actions/oilCard";
import { get } from "lodash";
import { connect } from "@tarojs/redux";
import {
  SearchComponent,
  OilCardComponent,
  NoOilCardComponent
} from "../components";
import { getWindowHeight } from "@utils/style";

import "./oil-card-list.scss";

@connect(state => state.oilCard, actions)
export default class PageOilCardList extends Component {
  config = {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#001525",
    navigationBarTitleText: "老吕加油企业版",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
    onReachBottomDistance: 30
  };
  // _ 下划线开头为 2自有车参数  1大写字母开头为外请车参数 常规的为公用参数
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      scrollViewHeight: 200,
      pageSize: 10,
      cardSort: 2,
      createDept: -1,
      cardSource: -1,
      _data: [],
      Data: [],
      _count: 1,
      Count: 1,
      _page: 1,
      Page: 1,
      _loading: true,
      _hasMore: false,
      Loading: true,
      HasMore: false,
      actionType: 0
    };
  }
  // tab 切换
  handleClick = value => {
    let { _data, Data, cardSort, current } = this.state;
    let _loadingVis = false;
    let loadingVis = false;
    if (current === value) {
      return;
    }
    if (value === 0) {
      cardSort = 2;
      _loadingVis = true;
    } else if (value === 1) {
      cardSort = 1;
      loadingVis = true;
    }
    this.setState({
      current: value,
      cardSort,
      _loading: _loadingVis,
      Loading: loadingVis
    });
    this.props.SetNullOilCardList(); //搜索条件更改时，清空state存入的list
    this.getList({ cardSort });
  };

  // 获取参数
  getPayload = () => {
    const { _page, Page, pageSize, cardSort, actionType } = this.state;
    if (cardSort === 2) {
      return { page: _page, pageSize, cardSort, actionType, cardSource: 10 };
    }
    return { page: Page, pageSize, cardSort, actionType, cardSource: 10 };
  };
  getNewList = payload => {
    this.props.SetNullOilCardList();
    Taro.showLoading({ mask: true });
    this.props.getOilCardList({ payload, cardSort: 1 }).then(result => {
      this.commonResultSet(result, payload);
    });
  };
  commonResultSet = (result, payload) => {
    let { err, res: { count, list } } = result;
    let { _page, Page, pageSize, _data, Data } = this.state;
    if (err === 0) {
      if (payload.cardSort === 2) {
        this.setState({
          _data: _data.concat(list),
          _count: count,
          _hasMore: _page * pageSize < count,
          _loading: false
        });
      } else if (payload.cardSort === 1) {
        this.setState({
          Data: Data.concat(list),
          Count: count,
          HasMore: Page * pageSize < count,
          Loading: false
        });
      }
    }
  };
  getList = (params, callback, firstMount) => {
    Taro.showLoading({ mask: true });
    const { getOilCardList } = this.props;
    const payload = { ...this.getPayload(), ...params, isMini: 1 };
    if (firstMount) {
      //是否首次加载 从首页过来的
      this.setState({
        isFirstMount: false
      });
    }
    getOilCardList(payload)
      .then(result => {
        // if (
        //   firstMount &&
        //   get(result, ["res", "count"]) === 0 &&
        //   get(payload, "cardSort") === 2
        // ) {
        //   //若自有车count是0，则默认外请车
        //   this.setState({
        //     current: 1
        //   });
        //   this.getNewList(payload);
        //   return;
        // }
        this.commonResultSet(result, payload);
        callback && callback();
      })
      .catch(err => {
        callback && callback();
        this.setState({
          Loading: false,
          _loading: false
        });
      });
  };

  componentDidMount() {
    this.setScrollViewHeight();
    this.props.getMiniCardTab().then(result => {
      if (
        get(result, ["res", "private"]) === 0 &&
        get(result, ["res", "public"]) === 1
      ) {
        this.setState({
          cardSort: 1,
          current: 1
        });
        this.getList({ cardSort: 1 });
      } else {
        this.getList();
      }
      this.setState({
        showList: true
      });
    });
  }

  componentDidShow() {
    this.setState({
      _loading: true,
      Loading: true
    });
    if (this.state.showList) this.getList({ page: 1 });

    //  const { refresh } = get(this.$scope, "params", {});
    //  refresh && this.getList();
  }

  handleLoadMore = () => {
    let { cardSort, _hasMore, HasMore } = this.state;
    const { listPage } = this.props;
    if (cardSort === 2 && _hasMore) {
      this.setState({
        _loading: true,
        _page: listPage + 1
      });
      this.getList({ page: listPage + 1 });
    } else if (cardSort === 1 && HasMore) {
      this.setState({
        Loading: true,
        Page: listPage + 1
      });
      this.getList({ page: listPage + 1 });
    }
  };

  onReachBottom() {
    this.handleLoadMore();
  }

  onPullDownRefresh() {
    let { cardSort } = this.state;
    if (cardSort === 2) {
      this.setState({
        _loading: true,
        _page: 1,
        _data: []
      });
    } else if (cardSort === 1) {
      this.setState({
        Loading: true,
        Page: 1,
        Data: []
      });
    }
    this.props.SetNullOilCardList();
    this.getList({ page: 1 }, Taro.stopPullDownRefresh());
  }

  // scroll-view 高度
  setScrollViewHeight = () => {
    const windowHeight = getWindowHeight();
    // 顶部固定区域 95PX
    this.setState({
      scrollViewHeight: windowHeight - 95
    });
  };
  // 充值成功的回调
  refreshList = key => {
    if (!key) {
      key = this.state.cardSort;
    }
    if (key === 2) {
      this.setState({
        _loading: true,
        _page: 1,
        _data: []
      });
    } else if (key === 1) {
      this.setState({
        Loading: true,
        Page: 1,
        Data: []
      });
    }
    this.props.SetNullOilCardList(); //清空数据 刷出第一页
    this.getList({ page: 1, cardSort: key });
  };
  componentDidHide() {
    this.setState({
      Loading: true,
      _loading: true
    });
    this.props.SetNullOilCardList();
  }
  componentWillUnmount() {
    this.props.SetNullOilCardList();
    Taro.reLaunch({
      url: "../index/index"
    });
  }

  render() {
    const {
      scrollViewHeight,
      current,
      // _data,
      // Data,
      _loading,
      Loading,
      _hasMore,
      HasMore
    } = this.state;
    const { cardInfo } = this.props;
    const tabList = [{ title: "自有车加油卡" }, { title: "外请车结算卡" }];
    return (
      <View className="container oil-card-list">
        <View className="oil-card-list__search">
          <SearchComponent isDisabled={true} />
        </View>
        <View className="oil-card-list__tabs">
          <AtTabs
            current={current}
            tabList={tabList}
            onClick={this.handleClick.bind(this)}
          />
        </View>
        {/* <ScrollView 
					scrollY
					className='oil-card-list__scroll-view'
					id='scrollView'
					onScrollToLower={this.handleLoadMore}
					lowerThreshold='30'
					style={`height: ${scrollViewHeight}px` }
					> */}
        <View
          className="oil-card-list__scroll-view"
          style={`height: ${scrollViewHeight}px`}
        >
          <AtTabsPane current={current} index={0}>
            {cardInfo.length
              ? <OilCardComponent
                  list={cardInfo}
                  hasMore={_hasMore}
                  loading={_loading}
                  onConfirm={this.refreshList.bind(this, 2)}
                />
              : !_loading && <NoOilCardComponent />}
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            {cardInfo.length
              ? <OilCardComponent
                  list={cardInfo}
                  hasMore={HasMore}
                  loading={Loading}
                  onConfirm={this.refreshList.bind(this, 1)}
                />
              : !Loading && <NoOilCardComponent />}
          </AtTabsPane>
        </View>
        {/* </ScrollView> */}
      </View>
    );
  }
}

// export default connect( ( state => state.oilCard), actions)(PageOilCardList);
