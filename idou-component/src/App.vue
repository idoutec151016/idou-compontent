<template>
  <div id="app">
    <idou-car-info :areas="areas" @update="updateCarInfo" theme-color="green" :data="carInfo"></idou-car-info>
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
      showOcr: true,
      areas: [],
      carInfo: {
        areaCode: "130304",
        areaName: "北戴河区",
        businessCar: "1",
        isSupportBusinessCar: "0",
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
    }
  }
}
</script>

<style>
#app {
}
</style>
