<template>
  <div class="idou-car-info">
    <van-cell title="车险购买" class="title">
      <template #title>
        <div class="label header-title">车险购买</div>
      </template>
      <template v-slot:icon>
        <div class="vertical-line">
          <div class="line" :style="{ background: themeColor }"></div>
        </div>
      </template>
      <template v-slot>
        <div class="driving-icon-container">
          <div class="driving-icon" :style="{ color: themeColor }" @click="showOcr = true">
            <!-- <img src="./xiangji1.png" class="icon"> -->
            <i class="van-icon van-icon-photograph"></i>
            <span style="margin-left: 3px;">行驶证扫描</span>
          </div>
        </div>

      </template>
    </van-cell>
    <van-field 
      :error-message="errMessage.areaName"
      v-model="carInfo.areaName"
      readonly
      input-align="right"
      @click="showAddress = true"
      placeholder="请选择投保城市"
    >
      <template #label>
        <div class="label">投保城市</div>
      </template>
      <template #extra>
        <div class="line-icon"></div>
      </template>
    </van-field>
    <!-- :readonly="licenseNoChecked" -->
    <van-field 
      :error-message="errMessage.licenseNo"
      :formatter="formatter"
      v-model="carInfo.licenseNo"
      label="车牌号"
      input-align="right"
      maxlength="8"
      @blur="() => { checkByKey('licenseNo') }"
      @focus="onFocus"
      placeholder="请输入车牌号"
    >
      <template #label>
        <div class="label">车牌号</div>
      </template>
      <!-- <template v-slot:button>
        <van-checkbox v-model="licenseNoChecked" @change="(s) => { s? carInfo.licenseNo = '': ''; checkByKey('licenseNo') }" :checked-color="themeColor" icon-size="16px">
          <span :style="{ color: themeColor, fontSize: '12px' }">未上牌</span>
        </van-checkbox>
      </template> -->
    </van-field>
    <van-field
      @blur="() => { checkByKey('carOwner') }"
      :error-message="errMessage.carOwner"
      v-model="carInfo.carOwner"
      @focus="focusCarOwner"
      input-align="right"
      maxlength="20"
      placeholder="请输入车主姓名">
      <template #label>
        <div class="label">车主姓名</div>
      </template>
    </van-field>
    <van-cell class="is-business-car" v-if="isSupportBusinessCar == '1'">
      <template #title>
        <div class="label">企业车</div>
      </template>
      <template v-slot>
        <van-switch :value="carInfo.businessCar === '1'" @input="(s) => { carInfo.businessCar = s? '1': '0' }" inactive-color="#999" :active-color="themeColor" size="22px" />
      </template>
    </van-cell>
    <!-- 立即报价 -->
    <div class="car-info-btn">
      <van-button class="btn" :color="themeColor" round block @click="clickBth" native-type="submit">
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
            // if(this.licenseNoChecked) {
            //   return ''
            // }
            if(this.carInfo.licenseNo.length < 3) {
              // return '车牌号不能为空'
              this.carInfo.licenseNo = ''
              return ''
            }
            if(!regexCarNumber(k)) {
              return '车牌号格式不合法'
            }
            return ''
          },
          carOwner: (k) => {
            if(this.carInfo && this.carInfo.areaCode && this.carInfo.areaCode.substring(0,2) == '31') {
              return ''
            }
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
          // if(this.carInfo.licenseNo.length < 3) {
          //   this.carInfo.licenseNo = ''
          // }
          this.$emit('update', this.carInfo)
        }
      },
      changeArea(list) {
        const { areaCode, licensePrefix, areaCName: areaName } = list[2]
        this.supportBusinessCar(areaCode)
        this.carInfo = Object.assign(this.carInfo, { areaCode, licensePrefix, areaName })
      },
      onFocus(e) {
        console.log(e)
        e.target.value = ''
        if(this.carInfo.licenseNo.length <= 2) {
          this.carInfo.licenseNo = this.carInfo.licensePrefix || ''
        }
        setTimeout(() => {
          e.target.value = (this.carInfo.licenseNo || '')
        }, 30)
      },
      focusCarOwner(e) {
        e.target.value = ''
        setTimeout(() => {
          e.target.value = (this.carInfo.carOwner || '')
        }, 30)
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
  .label {
    width: 60px;
    display: inline-block;
    white-space: nowrap;
    text-align: justify;
    text-align-last: justify;
    text-justify: distribute;
    &.header-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
    &::after {
      display: block;
      width: 100%;
      content: '';
    }
  }
  // ::-webkit-input-placeholder {
  //   font-size: 16px;
  // }
  // /deep/ .van-field__label {
  //   width: 58px;
  //   // &::after {
  //   //   display: inline-block;
  //   //   width: 100%;
  //   //   content: '';
  //   //   height: 0;
  //   //   overflow: hidden;
  //   // }
  // }
  /deep/ .van-field__label span{
    
    
  }
  .is-business-car {
    height: 48px;
    align-items: center;
    /deep/ .van-cell__value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
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
      position: absolute;
      line-height: 22px;
      top: 0;
      right: 6px;
      content: '否';
      font-size: 12px;
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
    // padding: 6px;
    // color: #fff;
    font-size: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 6px;
    .icon {
      width: 22px;
    }
    .van-icon-photograph {
      font-size: 16px;
    }
  }
  .car-info-btn {
    padding: 15px 16px 15px;
    .btn {
      box-shadow:  2px 2px 10px  rgba(0, 0, 0, 0.3);
    }
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