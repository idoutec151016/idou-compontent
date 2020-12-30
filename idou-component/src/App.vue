<template>
  <div id="app">
    <idou-car-info :areas="areas" @update="updateCarInfo" theme-color="green" :data="carInfo" :isSupportBusinessCarFn="isSupportBusinessCarFn">
      <div slot="icon">
        <!-- 图标 -->
        图标
      </div>
    </idou-car-info>
    <idou-loading v-model="show"></idou-loading>
  </div>
</template>

<script>
import { areas } from '@/test/citys.js'
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      show: true,
      showOcr: true,
      areas: [],
      carInfo: {
        areaCode: "130304",
        areaName: "",
        businessCar: "1",
        isSupportBusinessCar: "1",
        carOwner: "李四",
        licenseNo: "冀C12323",
        licensePrefix: "冀C",
      }
    }
  },
  created() {
    setTimeout(() => {
      this.areas = [].concat(areas)
      console.log(this.areas)
    }, 5000)
  },
  methods: {
    updateCarInfo(obj) {
      console.log(obj)
    },
    changeArea(data) {
      console.log(data)
    },
    isSupportBusinessCarFn() {
      // ajax(() => {
      //   callback(result)
      // })
    }
  }
}
</script>

<style>
#app {
}
</style>
