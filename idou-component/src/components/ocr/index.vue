<template>
  <van-popup v-model="show" position="center" @close="close" get-container="body" :style="{ width: '95%', minWidth: '300px' }">
    <div class="idou-ocr-main">
      <div class="idou-title">行驶证主页<div class="idou-address-close" @click="close"></div></div>
      <div class="idou-ocr-content">
        <van-uploader :after-read="afterRead" style="width: 100%">
          <div class="idou-ocr-bg">
            <img src="./ocr-bg.png" v-show="status == 'start' || status == 'loading'">
            <!-- <div v-show="status == 'loading'" size="40px">loading</div> -->
            <idou-loading class="idou-ocr-loading" size="30px" :value="status == 'loading'">loading</idou-loading>

            <img v-show="status == 'finish'" :src="orcImg">
            <div v-show="status == 'error'">err</div>
          </div>
          <div class="tap" v-show="status == 'start'">
            <img src="./tap.png">
          </div>
        </van-uploader>
        <div v-if="status == 'finish'" class="prompt-text">识别结果可能存在误差，请核对并修改</div>
        <div v-else class="prompt-text" style="color: #333">识别结果可能存在误差，请核对并修改</div>

        <div v-show="status == 'finish' || status == 'error'">
          <van-field label="车牌号" v-model="carInfo.licenseNo"  maxlength="8"  placeholder="请输入车牌号"></van-field>
          <van-field label="车主姓名" v-model="carInfo.carOwner"  maxlength="20" placeholder="请输入车主姓名"></van-field>
          <van-field label="品牌型号" v-model="carInfo.modelName" maxlength="20" placeholder="请输入品牌型号"></van-field>
          <van-field label="车牌识别码" v-model="carInfo.frameNo" maxlength="17" placeholder="请输入车牌识别码"></van-field>
          <van-field label="发动机号" v-model="carInfo.engineNo"  maxlength="17" placeholder="请输入发动机号"></van-field>
          <van-field label="注册日期" v-model="carInfo.enrollDate" readonly placeholder="请选择注册日期" @click="clickPickerDate('enrollDate')">
            <div slot="right-icon" class="ocr-right-icon"></div>
          </van-field>
          <van-field label="发证日期" v-model="carInfo.certificateDate" readonly placeholder="请选择发证日期" @click="clickPickerDate('certificateDate')">
            <div slot="right-icon" class="ocr-right-icon"></div>
          </van-field>
        </div>
        <div style="padding: 20px 0;">
          <van-button  :color="themeColor" round block @click="clickBth" native-type="submit">
            <span style="font-size: 20px">确认</span>
          </van-button>
        </div>
      </div>
    </div>
    <van-popup v-model="pickerDateShow" position="bottom">
      <van-datetime-picker class="current-time"  v-model="currentDate" type="date" @confirm="confirm" @cancel="cancel" :max-date="maxDate" :min-date="minDate"/>
    </van-popup>
  </van-popup>
</template>

<script>
  const OCR_PARARM = {
    licenseNo: '号牌号码',
    carOwner: '所有人',
    modelName: '品牌型号',
    frameNo: '车辆识别代号',
    engineNo: '发动机号码',
    enrollDate: '注册日期',
    certificateDate: '发证日期',
  }
  import axios from 'axios'
  import idouLoading from '../loading/index'
  export default {
    name: 'idou-ocr',
    components: {
      idouLoading
      // 'address-list': () => import('./address.vue')
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      themeColor: {
        type: String,
        default: 'green'
      }
    },
    data() {
      return {
        carInfo: {},
        show: false,
        loading: false,
        status: 'start', // loading, finish, start
        orcImg: '',
        minDate: new Date((new Date().getFullYear()-20)+'-'+"01"+'-'+'01'),
        maxDate: new Date(),
        currentDate: '',
        currentDateParams: '',
        pickerDateShow: false
      }
    },
    methods: {
      clickPickerDate(k) {
        this.currentDateParams = k
        this.pickerDateShow = true
      },
      cancel() {
        this.pickerDateShow = false
      },
      confirm(t) {
        this.pickerDateShow = false
        let y = t.getFullYear(), m = t.getMonth() + 1, d = t.getDate()
        this.carInfo[this.currentDateParams] = y + '-' + (m < 10? '0' +m : m) + '-' +(d < 10? '0' + d : d)
      },
      init() {
        this.carInfo = {
          licenseNo: '',
          carOwner: '',
          modelName: '',
          frameNo: '',
          engineNo: '',
          enrollDate: '',// 注册日期
          certificateDate: '',
          currentDate: '',
        }
        this.status = 'start'
        this.orcImg = ''
      },
      clickBth() {
        console.log(this.status)
        if(this.status !== 'finish'){
          this.$toast('请上传行驶证')
          return
        }
        this.$emit('update', this.carInfo)
        this.close()
      },
      close() {
        this.$emit('input', false)
      },
      afterRead(e) {
        console.log(e);
        const file = e.file;
        if(file.size > 500 * 1024) {
          this.orcCompress(e.content)
        } else {
          this.orcUpload(e.content)
        }
      },
      orcCompress(base64) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        
        // 最大尺寸限制
        var maxWidth = 600, maxHeight = 600;
        var img = new Image()
        img.src = base64
        img.onload = () => {
          var originWidth  = img.width;
          var originHeight = img.height;
          // 目标尺寸
          var targetWidth = originWidth, targetHeight = originHeight;
          if(originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 更宽，按照宽度限定尺寸
              targetWidth = maxWidth;
              targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
          }

          console.log(targetWidth, targetHeight)
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          // 清除画布
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          // 图片压缩
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          var ndata = canvas.toDataURL('image/jpeg', 0.1);
          this.status = 'finish'
          this.orcUpload(ndata)
          // console.log(width, height)
          // ctx.drawImage(img, 0, 0, w, h);
        }
        
      },
      orcUpload(data) {
        this.status = 'loading'
        const imageBase = data.replace(/^data:image\/\w+;base64,/, '')
        const OCR_API = 'https://component.duduyl.cn/api/ocr/recognition'
        axios({
          url: OCR_API,
          method: 'post',
          data: {
            imageBase
          },
        }).then((res) => {
            console.log(res)
            if(res.data.success) {
              this.status = 'finish'
              this.orcImg = data
              const OCRData = res.data.data.resMap || {}
              console.log(OCRData)
              for(let k in this.carInfo) {
                this.carInfo[k] = OCRData[OCR_PARARM[k]]
              }
              console.log(this.carInfo)
            } else {
              this.status = 'error'
            }
        }).catch(() => {
          this.status = 'error'
        })
      }
    },
    watch: {
      value: {
        handler(show) {
          this.init()
          this.show = show
        },
        immediate: true
      },
    }
  }
</script>

<style lang="less" scoped>
.idou-ocr-content {
  padding: 5px 15px;
  .tap{
    position: absolute;
    width:50px;
    height:50px;

    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    img{
        width:50px;
        animation: move 1s infinite;
    }
    // p{
    //     font-size 14px
    //     width:100px
    //     color:#333
    //     animation move 1s infinite

    // }
}
}
.ocr-right-icon {
  width: 8px;
  height: 8px;
  border-top: 2px solid #999;
  border-right: 2px solid #999;
  transform: rotate(45deg);
}
.prompt-text {
  color: rgb(213, 211, 48);
  font-size: 14px;
  padding-left: 15px;
  padding-top: 5px;
}
.idou-ocr-bg {
  width: 88vw;
  height: 200px;
  position: relative;
  .idou-ocr-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%, -50%);
  }
  img {
    max-width: 100%;
    max-height: 100%;
    display:block;
    object-fit: contain;
    margin: 0 auto;
  }
}
.idou-title {
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
  color: #333;
  position: relative;
  .idou-address-close {
    position: absolute;
    top: 50%;
    right: 30px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    &::before, &::after {
      position: absolute;
      content: ' ';
      background-color: #333;
      left: 20px;
      width: 1px;
      height: 20px;
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after  {
      transform: rotate(-45deg);
    }
  }
}
@keyframes move{
  0% {
      transform: translateY(5px)
      }
  50% {
    transform: translateY(-5px)
  }
  100% {
    transform: translateY(5px)

  }
}
</style>