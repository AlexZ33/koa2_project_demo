# koa2_project_demo
koa2 + react+ webpack + mysql + ejs

# start
https://github.com/ChenShenhai/koa2-note/blob/master/note/project/start.md
#　概要

    - koa2 搭建服务
    - MySQL作为数据库
        - mysql 5.7 版本
        - 储存普通数据
        - 存储session登录态数据
    - 渲染
        - 服务端渲染：ejs作为服务端渲染的模板引擎
        - 前端渲染：用webpack2环境编译react.js动态渲染页面，使用ant-design框架


# 目录结构
```aidl
├── init # 数据库初始化目录
│   ├── index.js # 初始化入口文件
│   ├── sql/    # sql脚本文件目录
│   └── util/   # 工具操作目录
├── package.json 
├── config.js # 配置文件
├── server  # 后端代码目录
│   ├── app.js # 后端服务入口文件
│   ├── codes/ # 提示语代码目录
│   ├── controllers/    # 操作层目录
│   ├── models/ # 数据模型model层目录
│   ├── routers/ # 路由目录
│   ├── services/   # 业务层目录
│   ├── utils/  # 工具类目录
│   └── views/  # 模板目录
└── static # 前端静态代码目录
    ├── build/   # webpack编译配置目录
    ├── output/  # 编译后前端代码目录&静态资源前端访问目录
    └── src/ # 前端源代码目录
```

# 分层设计
## 后端代码目录

```aidl
└── server
    ├── controllers # 操作层 执行服务端模板渲染，json接口返回数据，页面跳转
    │   ├── admin.js
    │   ├── index.js
    │   ├── user-info.js
    │   └── work.js
    ├── models # 数据模型层 执行数据操作
    │   └── user-Info.js
    ├── routers # 路由层 控制路由
    │   ├── admin.js
    │   ├── api.js
    │   ├── error.js
    │   ├── home.js
    │   ├── index.js
    │   └── work.js
    ├── services # 业务层 实现数据层model到操作层controller的耦合封装
    │   └── user-info.js
    └── views # 服务端模板代码
        ├── admin.ejs
        ├── error.ejs
        ├── index.ejs
        └── work.ejs
```

# 数据库设计
[IntelliJ IDEA 如何连接MySQL](https://jingyan.baidu.com/article/2d5afd6923328b85a2e28e0b.html)
## 初始化数据库脚本
### 脚本目录
`init/sql/user_info.sql`
```aidl

/*CREATE TABLE*/

CREATE TABLE  IF NOT EXISTS `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT  NULL ,
  `nick` varchar(255) DEFAULT NULL ,
  `detail_info` longtext DEFAULT NULL ,
  `create_time` varchar(20) DEFAULT NULL,
  `modified_time` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user_info` set name='admin001', email='admin001@example.com',password='123456';
```
#  路由设计
使用koa-router中间件
## 路由目录
```aidl
# ...
└── server # 后端代码目录
    └── routers
        ├── admin.js # /admin/* 子路由
        ├── api.js #  resetful /api/* 子路由
        ├── error.js #   /error/* 子路由
        ├── home.js # 主页子路由
        ├── index.js # 子路由汇总文件
        └── work.js # /work/* 子路由
 # ...
```
## 子路由配置

### resetful API 子路由

例如api子路由/user/getUserInfo.json，整合到主路由，加载到中间件后，请求的路径会是 http://www.example.com/api/user/getUserInfo.json

`/server/routers/api.js`

```aidl
/**
 * restful api 子路由
 */

const router = require('koa-router')()
const userInfoController = require('./../controllers/user-info')

const routers = router
  .get('/user/getUserInfo.json', userInfoController.getLoginUserInfo)
  .post('/user/signIn.json', userInfoController.signIn)
  .post('/user/signUp.json', userInfoController.signUp)

module.exports = routers
```
### 子路由汇总
`server/routers/index.js`

```aidl
**
 * 整合所有子路由
 */

const router = require('koa-router')()

const home = require('./home')
const api = require('./api')
const admin = require('./admin')
const work = require('./work')
const error = require('./error')

router.use('/', home.routes(), home.allowedMethods())
router.use('/api', api.routes(), api.allowedMethods())
router.use('/admin', admin.routes(), admin.allowedMethods())
router.use('/work', work.routes(), work.allowedMethods())
router.use('/error', error.routes(), error.allowedMethods())
module.exports = router
```
### app.js加载路由中间件
`server/app.js`
```aidl
const routers = require('./routers/index')

// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())
```
# webpack2环境搭建

由于 前端渲染是通过react.js渲染的，这就需要webpack2 对react.js及其相关JSX，ES6/7代码进行编译和混淆压缩。
## 安装和文档
可访问网https://webpack.js.org/
## 配置webpack2编译react.js + less + sass + antd 环境
### 文件目录
```aidl
└── static # 项目静态文件目录
    ├── build
    │   ├── webpack.base.config.js # 基础编译脚本
    │   ├── webpack.dev.config.js # 开发环境编译脚本
    │   └── webpack.prod.config.js # 生产环境编译脚本
    ├── output # 编译后输出目录
    │   ├── asset
    │   ├── dist
    │   └── upload
    └── src # 待编译的ES6/7、JSX源代码
        ├── api
        ├── apps
        ├── components
        ├── pages
        ├── texts
        └── utils
```
### webpack2 编译基础配置
`webpack.base.config.js`

#  使用react.js
# 登录注册功能实现
# session登录态判断处理
# 参考
[Nodejs学习记录： koa2](https://segmentfault.com/a/1190000012858435)
[koa2进阶学习笔记](https://cnodejs.org/topic/58ac640e7872ea0864fedf90)