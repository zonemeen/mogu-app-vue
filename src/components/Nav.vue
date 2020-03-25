<template>
  <div class="nav">
    <router-link to="/money">
      <svg>
        <use xlink:href="#label" />
      </svg>
      记账</router-link
    >
    <router-link to="/labels">标签</router-link>
    <router-link to="/statistics">统计</router-link>
  </div>
</template>

<script>
import x from "@/assets/icons/label.svg";

console.log(x);
export default {
  name: "Nav"
};
</script>

<style lang="scss" scoped>
.nav {
  border: 1px solid red;
}
</style>
