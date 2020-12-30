<template>
  <div class="idou-car-info">
    <van-cell title="车险购买" size="large" class="title">
      <template v-slot:icon>
        <div class="vertical-line">
          <div class="line" :style="{ background: themeColor }"></div>
        </div>
      </template>
      <template v-slot>
        <div class="driving-icon-container">
          <div class="driving-icon" :style="{ background: themeColor }" @click="showOcr = true">
            <img src="./xiangji.png" class="icon">
            <span style="margin-left: 3px;">行驶证识别</span>
          </div>
        </div>

      </template>
    </van-cell>
    <van-field 
      :error-message="errMessage.areaName"
      v-model="carInfo.areaName"
      label="投保城市"
      readonly
      size="large"
      input-align="right"
      @click="showAddress = true"
      placeholder="请选择投保城市"
    >
      <template #extra>
        <div class="line-icon"></div>
      </template>
    </van-field>
    <van-field 
      :error-message="errMessage.licenseNo"
      :formatter="formatter"
      v-model="carInfo.licenseNo"
      label="车牌号"
      input-align="right"
      :readonly="licenseNoChecked"
      size="large"
      @blur="() => { checkByKey('licenseNo') }"
      @focus="onFocus"
      placeholder="请输入车牌号"
    >
      <template v-slot:button>
        <van-checkbox v-model="licenseNoChecked" @change="(s) => { s? carInfo.licenseNo = '': ''; checkByKey('licenseNo') }" :checked-color="themeColor" icon-size="16px" shape="square">
          <span :style="{ color: themeColor, fontSize: '12px' }">未上牌</span>
        </van-checkbox>
      </template>
    </van-field>
    <van-field
      @blur="() => { checkByKey('carOwner') }"
      :error-message="errMessage.carOwner"
      v-model="carInfo.carOwner"
      input-align="right"
      label="车主姓名" size="large"
      placeholder="请输入车主姓名">
    </van-field>
    <van-cell title="是否是企业车" size="large" v-if="isSupportBusinessCar == '1'">
      <template v-slot>
        <van-switch :value="carInfo.businessCar === '1'" @input="(s) => { carInfo.businessCar = s? '1': '0' }" inactive-color="#999" :active-color="themeColor" size="22px" />
      </template>
    </van-cell>
    <!-- 立即报价 -->
    <div class="car-info-btn">
      <van-button :color="themeColor" round block @click="clickBth" native-type="submit">
        <span class="car-info-text">立即报价</span>
      </van-button>
    </div>
    <idou-address :areas="areas" @changeArea="changeArea" v-model="showAddress"></idou-address>
    <idou-ocr v-model="showOcr" @update="updateCar"></idou-ocr>

  </div>
</template>

<script>
  /** **/
  import { deepClone, regexCarNumber, checkName } from '../../js/util.js'
  import idouAddress from '../address/index'
  import idouOcr from '../ocr/index'
  export default {
    name: 'idou-car-info',
    components: {
      idouAddress,
      idouOcr
    },
    props: {
      data: {
        type: Object,
        default: () => {
          return {
            areaCode: '',
            licensePrefix: '',
            areaName: '',
            licenseNo: '',
            carOwner: '',
            businessCar: '0'
          }
        }
      },
      isSupportBusinessCarFn: {
        type: Function,
        default: () => null
      },
      areas: {
        type: Array,
        default: () => []
      },
      orcIcon: {
        type: String,
        default: ''
      },
      themeColor: {
        type: String,
        default: 'green'
      }
    },
    data() {
      return {
        showOcr: false,
        showAddress: false,
        licenseNoChecked: false, // 是否上牌
        checked: false,
        carInfo: {},
        errMessage: {
          areaName: '',
          licenseNo: '',
          carOwner: ''
        },
        rules: {
          areaName: function(k) {
            if(!k) {
              return '投保城市不能为空'
            }
            return ''
          },
          licenseNo: (k) => {
            if(this.licenseNoChecked) {
              return ''
            }
            if(!k) {
              return '车牌号不能为空'
            }
            if(!regexCarNumber(k)) {
              return '车牌号格式不合法'
            }
            return ''
          },
          carOwner: function(k) {
            if(!k) {
              return '车主姓名不能为空'
            }
            if(!checkName(k)) {
              return '车主姓名格式不合法'
            }
            return ''
          }
        },
        isSupportBusinessCar: '0'
      }
    },
    methods: {
      formatter(value) {
        return value.toUpperCase().replace(/\s+/g, '')
      },
      checkByKey(k) {
        this.errMessage[k] = this.rules[k](this.carInfo[k])
      },
      checkAll() {
        Object.keys(this.errMessage).forEach(k => {
          this.checkByKey(k)
        })
        return Object.keys(this.errMessage).every(k => !this.errMessage[k])
      },
      clickBth() {
        // 是否校验通过
        const IS_CAN_EMIT = this.checkAll()
        if(IS_CAN_EMIT) {
          console.log('校验通过')
          this.$emit('update', this.carInfo)
        }
      },
      changeArea(list) {
        const { areaCode, licensePrefix, areaCName: areaName } = list[2]
        this.supportBusinessCar(areaCode)
        this.carInfo = Object.assign(this.carInfo, { areaCode, licensePrefix, areaName })
      },
      onFocus() {
        if(this.carInfo.licenseNo.length <= 2) {
          this.carInfo.licenseNo = this.carInfo.licensePrefix
        }
      },
      supportBusinessCar(areaCode) {
        this.isSupportBusinessCarFn(areaCode, (s) => {
          this.isSupportBusinessCar = s
        })
      },
      updateCar(data) {
        this.carInfo = Object.assign(this.carInfo, data)
      }
    },
    watch: {
      data: {
        handler(data) {
          this.carInfo = deepClone(data)
          if(this.carInfo.areaCode) {
            this.supportBusinessCar(this.carInfo.areaCode)
          }
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>

<style lang="less" scoped>
.idou-car-info {
  background: #ffffff;
  /deep/ .van-cell.title {
    padding: 0 16px;
    height: 48px;
    .van-cell__title {
      line-height: 48px;
    }
  }
  /deep/ .van-cell__value .van-switch {
    &::after {
      display: inline-block;
      position: relative;
      right: 5px;
      top: -3px;
      content: '否';
      font-size: 14px;
      color: #fff;
    }
  }
  .vertical-line {
    position: relative;
    margin-right: 6px;
    .line {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 15px;
      content: "";
    }
  }
  .driving-icon-container {
    height: 100%;
    line-height: 14px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .driving-icon {
    padding: 6px;
    color: #fff;
    font-size: 12px;
    display: flex;
    // flex-direction: column;
    align-items: center;
    border-radius: 6px;
    .icon {
      width: 12px;
    }
  }
  .car-info-btn {
    padding: 30px 16px 0;
    .car-info-text {
      font-size: 16px;
    }
  }
}
.line-icon {
  position: relative;
  width: 8px;
  &::before {
    position: absolute;
    top: 50%;
    display: block;
    width: 8px;
    height: 8px;
    content: "";
    border-top: 1px solid #999;
    border-right: 1px solid #999;
    transform: rotate(45deg) translateY(-50%);
  }
}
</style>