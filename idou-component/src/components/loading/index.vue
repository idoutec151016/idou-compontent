<template>
  <div class="idou-loading" v-show="value">
    <span class="idou-loading-spinner" :style="style">
      <i v-for="(item, i) in 12" :key="i"></i>
    </span>
    <div class="idou-loading-text">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  const DEFAULT_COLOR = 'rgb(25, 137, 250)';
  export default {
    name: 'idou-loading',
    props: {
      size: {
        type: String,
        default: '24px'
      },
      color: {
        type: String,
        default: DEFAULT_COLOR
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      style() {
        return {
          color:  this.color,
          width: this.size,
          height: this.size
        };
      }
    }
  }
</script>

<style lang="scss" scoped>
$list: 12;
.idou-loading {
  position: relative;
  color: #c8c9cc;
  display: flex;
  font-size: 0;
  vertical-align: middle;
  flex-direction: column;
   align-items: center;
  .idou-loading-text {
    display: inline-block;
    padding-top: 4px;
    color: #969799;
    font-size: 14px;
    vertical-align: middle;
  }
  .idou-loading-spinner {
    position: relative;
    display: inline-block;
    width: 24px;
    height: 24px;
    animation: circular .8s linear infinite;
    animation-timing-function: steps(12);

    i {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      &::before {
        width: 2px;
        height: 25%;
        content: ' ';
        display: block;
        margin: 0 auto;
        border-radius: 40%;
        background-color: currentColor;
      }
      @for $i from 1 through 12 {
        &:nth-child(#{$i}){//+1是除了第一个以外的li
          opacity: (#{1 - (0.75 / 12) * ($i - 1)} );
          transform: rotate(#{$i * 30}deg);
        }
      }

      // @each $c in $list {
      //   $i:index($list, $c);
      //   &:nth-child(#{$i}){//+1是除了第一个以外的li
      //     color: red;
      //   }
      // }
    }
  }
}

@keyframes circular {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>