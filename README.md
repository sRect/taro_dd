## Taro 写钉钉小程序
> [钉钉小程序](http://taro-docs.jd.com/taro/docs/GETTING-STARTED#%E9%92%89%E9%92%89%E5%B0%8F%E7%A8%8B%E5%BA%8F)
___

### 安装插件
```shell
yarn add @tarojs/plugin-platform-alipay-dd
```

### 修改配置文件
+ config/index.js
```diff
{
- plugins: [],
+ plugins: [
+  '@tarojs/plugin-platform-alipay-dd'
+ ],
}
```

+ package.json
```diff
{
  "scripts": {
+    "build:dd": "taro build --type dd",
+    "dev:dd": "set NODE_ENV=production && taro build --type dd --watch",
  }
}
```
