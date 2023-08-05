# RunnerGo-FE-Admin

> RunnerGo项目的前端管理后台部分, 基于React框架设计实现

## 本地使用

```shell
    # 克隆代码
    git clone https://github.com/Runner-Go-Team/runnergo-fe-admin-open.git
    # 切换目录
    cd runnergo-fe-admin-open
    # 下载依赖
    yarn install
    # 启动开发环境项目
    yarn start
```

## 默认超管账号密码
账号:runnergo
密码:runnergo

### OSS

如果想使用上传头像、上传场景内的csv、text文件等功能, 需要配置阿里云OSS服务

在根目录的config文件夹中的oss文件中

```js
export const OSS_Config = {
    region: 'Your Region',
    accessKeyId: 'Your AccessKeyId',
    accessKeySecret: 'Your AccessKeySecret',
    bucket: 'Your Bucket',
}
```

### 配置前端端服务地址

在根目录的config文件夹中的server文件中
该地址为 后端 manager 服务地址 exp http://{manager-host}:{manager:port}
```js
    const FE_Work_Base_URL = {
        development: '工作台开发环境地址',
        test: '工作台测试环境地址',
        production: '工作台线上环境地址',
};
```

### 配置后端服务地址

在根目录的config文件夹中的server文件中
permission 工程地址 exp http://{permission-host}:{permission:port}
```js
    const RD_BaseURL = {
        development: '开发环境地址',
        test: '测试环境地址',
        production: '线上环境地址',
    };
```

### 配置存/取Cookie 的Domain

在根目录的config文件夹中的server文件中,主要用于cookie域相关数据的共享.例如已登录状态.
需要与fe-open client.js 配置相同主域名

```js
   const DOMAIN = {
        development: '', // 开发环境domain 可为空
        test: '测试环境domain',
        production: '线上环境domain',
}
```

## 技术栈

- react, 基于react 17.0.2 版本进行开发
- less, 基于css预处理less实现css的管理与编写
- @arco-design/web-react, 基于字节开源组件库实现部分组件编写
- react-i18next, 实现多语言切换
- event-bus-hooks, 是一个效力于react的事件发布订阅工具
- axios, 一个基于promise的网络请求库,用于调用后端接口

