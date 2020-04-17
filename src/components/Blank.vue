<template>
  <div class="blank">
    <div class="icon">
      <Icon name="record" />
    </div>
    <span>暂时还没有记录. 快去记一笔吧~</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Icon from "@/components/Icon.vue";
@Component({
  components: { Icon }
})
export default class Blank extends Vue {}
</script>

<style lang="scss" scoped>
.blank {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .icon {
    width: 100px;
    height: 100px;
    svg {
      width: 80px;
      height: 80px;
    }
  }
  span {
    color: #999999;
    font-size: 12px;
  }
}
</style>
