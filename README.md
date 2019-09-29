# 小程序

### 开发命令
```
npm start
```


### 目录说明
```
├── config                 配置目录
|   ├── dev.js             开发时配置
|   ├── index.js           默认配置
|   └── prod.js            打包配置
└─src
    ├─actions              进行数据传输的action 
    ├─constants            常量储存（接口地址统一存放此处）           
    ├─images               图片           
    ├─pages                页面
    │  ├─components        公用组件库
    │  └─index             默认首页
    ├─reducers             state树（更改）
    ├─store                这个不动
    ├─styles               公用样式
    └─utils                公用函数
```

### 注意事项

* 开发依赖框架详见[taro官方文档](https://nervjs.github.io/taro/docs/README.html)
* components 组件代码超过 300 行，考虑拆分
* 主题色统一存放在styles/theme.scss
* 建议使用lodash（可简化开发，且能防止很多undefined报错的问题），用法详见[官方API](https://lodash.com/docs/4.17.11)
* 所有的组件均需使用taro的ui 组件库
* taro开发规则详情请见[最佳实践](https://nervjs.github.io/taro/docs/best-practice.html)
* 组件调用不支持 import {Demo} from '../components' 的写法（刚发现的~）
* 样式要有类名，不要直接组件名。因为如果你使用了组件名的话，多端统一,另外一端没有这个组件名对应的控件，则样式不起作用
* dist文件夹中有内容的时候，编译会经常报错，解决方案，编译之前把dist删除，配置package中做如下配置 "dev:weapp": "rimraf dist && npm run build:weapp -- --watch"
* propType 强制约束，必须定义 propTypes，并注释清楚 props 代表含义，方便维护查阅（详见：[react官方文档#PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes)）
* 函数遵循只做一件事原则（老生常谈啦~）

### 项目打包

* 测试环境执行：npm run testBuild:weapp
* 预发环境执行：npm run preBuild:weapp
* 生产环境执行：npm run build:weapp

