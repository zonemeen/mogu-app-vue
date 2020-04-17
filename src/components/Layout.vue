<template>
  <div class="layout" :class="`${classPrefix}-layout`">
    <div class="layout-content" :class="`${classPrefix}-layout-content`">
      <slot />
    </div>
    <Nav />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Nav from "@/components/Nav.vue";
@Component({
  components: { Nav }
})
export default class Layout extends Vue {
  @Prop(String) classPrefix?: string;
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  &-content {
    flex-grow: 1;
    padding-bottom: 52px;
  }
}
</style>
