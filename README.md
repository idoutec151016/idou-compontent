# idou-compontent

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
    ></idou-car-info>
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
|data|车辆数据默认值{areaCode: '',licensePrefix: '',areaName: '',licenseNo: '',carOwner: '',businessCar: '0',isSupportBusinessCar: '0'//是否支持企业车}[Object]|否|
|@update|接收车辆修改后的数据 [Object]|是|


-------

### loading组件参数
|参数名|参数说明|是否必须|
|:---:|:---:|:---:|
|v-model|是否显示|是|
|size| 大小 默认24px|否|
|color|主题色默认值 rgb(25, 137, 250) [Sting]|否|
|@update|接收车辆修改后的数据 [Object]|是|


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