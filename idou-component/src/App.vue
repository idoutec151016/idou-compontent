<template>
  <div id="app">
    <idou-car-info :areas="areas" @update="updateCarInfo" theme-color="green" :data="carInfo" :isSupportBusinessCarFn="isSupportBusinessCarFn">
      <div slot="icon">
        <!-- 图标 -->
        图标
      </div>
    </idou-car-info>
    <!-- <idou-loading v-model="show"></idou-loading> -->
    <!-- <p contenteditable="true" @blur="focus">这是一个可编辑的段落。<img style="width: 20px" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa2.att.hudong.com%2F27%2F81%2F01200000194677136358818023076.jpg&refer=http%3A%2F%2Fa2.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612340658&t=cafac0ad2c7888284926dd0c6b0759d2" alt=""></p> -->
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
    focus() {
       var lastEditSelection = getSelection()
       console.log(lastEditSelection)
       console.log(lastEditSelection.getRangeAt(0))
    },
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
