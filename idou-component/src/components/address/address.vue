<template>
  <div class="idou-city-container">
    <div class="idou-city-status" v-show="!areas.length">
      数据加载中...
    </div>
    <div class="idou-city-content" :style="swiperStyle" v-show="areas.length">
      <!-- 省 -->
      <div class="idou-picker-column">
        <div class="idou-picker-column__wrapper">
          <div v-for="(item, i) in provinces" :key="'province_'+i" @click="clickProvince(item)">
            <span :class="{ active: !!chooseAddressList[0] && item.areaCode === chooseAddressList[0].areaCode }">
              {{ item.areaCName }}
            </span>
          </div>
        </div>
      </div>
      <!-- 市 -->
      <div class="idou-picker-column">
        <div class="idou-picker-column__wrapper">
          <div v-for="(item, i) in citys" :key="'city_'+i" @click="clickCity(item)">
            <span :class="{ active: !!chooseAddressList[0] && item.areaCode === chooseAddressList[0].areaCode }">
              {{ item.areaCName }}
            </span>
          </div>
        </div>
      </div>
      <!-- 区 -->
      <div class="idou-picker-column">
        <div class="idou-picker-column__wrapper">
          <div v-for="(item, i) in countys" :key="'country_'+i" @click="clickCounty(item)">
            <span :class="{ active: !!chooseAddressList[0] && item.areaCode === chooseAddressList[0].areaCode }">
              {{ item.areaCName }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      areas: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        chooseAddressList: [],
        provinces: [],
        citysData: [],
        countysData: [],
        citys: [],
        countys: [],
        offset: 0,
      }
    },
    computed:{
      swiperStyle(){
        return{
          transform: `translate3d(${this.offset}, 0, 0)`,
          transition: '.6s cubic-bezier(0.18, 0.89, 0.32, 1)'
        }
      }
    },
    methods: {
      init() {
        this.citys =[]
        this.countys = []
        this.chooseAddressList = []
        this.offset = 0
      },
      clickProvince(data) {
        this.changeTitle(1)
        this.chooseAddressList = [data]
        this.handlerEreas('2')
        this.$emit('update', this.chooseAddressList)
      },
      clickCity(data) {
        this.changeTitle(2)
        this.chooseAddressList.splice(1, 2, data)
        this.handlerEreas('3')
        this.$emit('update', this.chooseAddressList)
      },
      clickCounty(data) {
        this.chooseAddressList.splice(2, 1, data)
        this.$emit('update', this.chooseAddressList, true)
      },
      handlerEreas(s) {
        if(s == '2') {// 处理市
          this.citys = this.citysData.filter(item => item.upperCode == this.chooseAddressList[0].areaCode)
        } else if(s == '3'){// 处理县区
          this.countys = this.countysData.filter(item => item.upperCode == this.chooseAddressList[1].areaCode)
        }
      },
      changeTitle(i) {
        // this.chooseAddressList.splice(i, 3)
        this.offset = -100 * i/3 + '%'
        // this.$emit('update', this.chooseAddressList)
      }
    },
    watch: {
      areas: {
        handler(list) {
          if(list.length) {
            let provinces = [], citysData = [], countysData = []

            this.areas.forEach(item => {
              if(item.provinceFlag === '1') {// 省
                provinces.push(item)
                citysData.push(item)
                countysData.push(item)
              } else if(item.upperCode.substr(2, 4) == '0000'){
                citysData.push(item)
                countysData.push(item)
              } else {
                countysData.push(item)
              }
            })

            this.provinces = provinces
            this.citysData = citysData
            this.countysData = countysData
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="less" scoped>
.idou-city-container {
  overflow: hidden;
  width: 100%;
  .idou-city-status {
    text-align: center;
    height: 300px;
    padding-top: 100px;
    color: #666;
  }
  .idou-city-content {
    width: 300%;
    display: flex;
    .idou-picker-column {
      height: 400px;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      .idou-picker-column__wrapper {
        >div {
          font-size: 14px;
          padding: 8px 15px;
          color: #666;
          .active {
            color: #000;
            &:after{
              display: inline-block;
              font-weight: bold;
              content: '\2713';
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
}
</style>