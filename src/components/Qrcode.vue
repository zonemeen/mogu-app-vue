<template>
  <div class="blank">
    <img src="../assets/qrcode.png" class="qrcode" alt="" />
    <span>请打开手机扫描上面二维码，效果更佳哦~</span>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component } from "vue-property-decorator";
  @Component({
  })
  export default class Qrcode extends Vue {}
</script>

<style lang="scss" scoped>
.blank {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 100px;

  span {
    color: #999999;
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
