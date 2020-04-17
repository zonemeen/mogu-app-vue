<template>
  <nav>
    <div>
      <router-link to="/bill" class="nav-item" active-class="selected">
        <Icon name="bill" class="icon" />
      </router-link>
      <span>明细</span>
    </div>
    <div>
      <router-link to="/money" class="nav-item" active-class="selected">
        <Icon name="money" class="icon icon-money" />
      </router-link>
      <span>记账</span>
    </div>
    <div>
      <router-link to="/charts" class="nav-item" active-class="selected">
        <Icon name="chart" class="icon" />
      </router-link>
      <span>图表</span>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Icon from "@/components/Icon.vue";

@Component({
  components: { Icon }
})
export default class Nav extends Vue {}
</script>

<style lang="scss" scoped>
nav {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 40px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: white;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon {
      width: 24px;
      height: 24px;
    }
    &.selected {
      color: #ffda47;
    }
  }
}
</style>
