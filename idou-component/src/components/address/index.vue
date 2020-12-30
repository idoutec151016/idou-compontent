<template>
  <van-popup v-model="show" position='bottom' @close="close" get-container="body">
    <div class="idou-address-main">
      <div class="idou-address-title" @click="closeAddress">选择地址<div class="idou-address-close"></div></div>
      <div class="idou-address-content">
        <div class="idou-address-top">
          <div v-for="(item, i ) in chooseAddressList" :key="i" @click="clickTitle(i)">{{ item.areaCName }}</div>
          <div v-show="chooseAddressList.length<3" class="idou-address-top-active">请选择</div>
        </div>
        <address-list :areas="areas" @update="updateCity" ref="address"></address-list>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import addressList from './address'
  export default {
    name: 'idou-address',
    components: {
      'address-list': addressList
    },
    props: {
      areas: {
        type: Array,
        default: () => []
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: false,
        chooseAddressList: []
      }
    },
    methods: {
      clickTitle(i) {
        this.$refs.address.changeTitle(i)
      },
      updateCity(list, isFinish) {
        this.chooseAddressList = [...list]
        if(isFinish) {// 主动关闭address
          this.closeAddress()
          this.$emit('changeArea', this.chooseAddressList)
        }
      },
      close() {
        this.$refs.address.init()
        this.$emit('input', false)
        this.chooseAddressList = []
      },
      closeAddress() {
        this.show = false
      }
    },
    watch: {
      value: {
        handler(show) {
          this.show = show
        },
        immediate: true
      },
    }
  }
</script>

<style lang="less" scoped>
.idou-address-main {
  .idou-address-top {
    display: flex;
    align-items: stretch;
    font-size: 14px;
    border-top: .5px solid #dfdfdf;
    border-bottom: .5px solid #dfdfdf;
    >div {
      padding: 15px 0px;
      margin: 0 15px;
    }
    .idou-address-top-active {
      border-width: 0 0 .5px 0;
      border-style: solid;
    }
  }
  .idou-address-title {
    text-align: center;
    font-size: 16px;
    padding: 10px 0;
    color: #afa8a8;
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
        background-color: #afa8a8;
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
}
</style>