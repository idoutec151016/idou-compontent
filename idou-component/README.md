# idou-component

# idou组件的使用

### 引入
``` javascript
 npm i idou-component -S 
```

### 注册

``` html
<template>
  <div>
    <idou-car-info 
      :areas="areas"
      @update="updateCarInfo"
      theme-color="green"
      :data="carInfo"
    >
    
    </idou-car-info>
    </div>
</template>
```
``` javascript

import { address, ocr, carInfo, loading } from 'idou-component'

export default {
  components: {
    [carInfo.name]: carInfo
  }

}

```
### carInfo组件参数
|参数名|参数说明|是否必须|
|:---:|:---:|:---:|
|areas|省市区 [Array]|是|
|theme-color|主题色默认值green [Sting]|否|
|orc-icon|OCR iconfont 号 [String]|是|
|isSupportBusinessCarFn| [Function] | callback '0' => 否|
|data|车辆数据默认值{areaCode: '',licensePrefix: '',areaName: '',licenseNo: '',carOwner: '',businessCar: '0'}[Object]|否|
|@update|接收车辆修改后的数据 [Object]|是|
|@changeArea|修改地址的数据 [Object]{ areaCode, areaName }|是|

---------
### carInfo组件插槽
|名称|参数说明|是否必须|
|:---:|:---:|:---:|
|icon|ocr的图标，支持自定义|-|

-------

### loading组件参数
|参数名|参数说明|是否必须|
|:---:|:---:|:---:|
|v-model|是否显示|是|
|size| 大小 默认24px|否|
|color|主题色默认值 rgb(25, 137, 250) [Sting]|否|


-------

### address组件参数
|参数名|参数说明|是否必须|
|:---:|:---:|:---:|
|v-model|是否显示|是|
|areas| 省市区 [Array]|否|
|@changeArea|修改后的地址[{省}, {市}, {区}]|是|

-------

### ocr组件参数
|参数名|参数说明|是否必须|
|:---:|:---:|:---:|
|v-model|是否显示|是|
|themeColor| 主题色 |否|
|@update|修改后的数据|是|



```javasript
  // 获取是否支持企业车
methods: {
  isSupportBusinessCarFn(callback) {
    /**
    * 参数
    * params = {
        payload: {
          cmd: "QueryCompanyCarmInfo",
          area_Code, //省市区编码
          channel,
          sourceCode,
          account,
          appid,
        },
        account,
        appid,

      }
    */

    axios.post('/mobile/basic', qs.stringify({ req: params }),).then(res => {
      callback('---参数---1 或者 0')
    })
  }
}


```