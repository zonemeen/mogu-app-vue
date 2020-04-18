<template>
  <ul class="tags" :class="{ [classPrefix + '-tags']: classPrefix }">
    <li
      v-for="(tag, index) in tagList"
      :key="index"
      @click="select(tag)"
      class="tags-item"
      :class="{ [classPrefix + '-tags-item']: classPrefix }"
    >
      <div
        class="tags-item-icon"
        :class="{
          selected: tag.name === selectedTag.name,
          [classPrefix + '-tags-item-icon']: classPrefix
        }"
      >
        <Icon :name="tag.name" />
      </div>
      <span>{{ tag.value }}</span>
    </li>
    <li v-if="dynamic" class="tags-item">
      <div class="tags-item-icon" @click="add">
        <Icon name="add" />
      </div>
      <span>添加</span>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Icon from "@/components/Icon.vue";
@Component({
  components: { Icon }
})
export default class TagList extends Vue {
  @Prop(String) classPrefix?: string;
  @Prop({ required: true, type: Object }) selectedTag!: TagItem;
  @Prop({ type: Boolean, default: false }) dynamic!: boolean;
  @Prop({ required: true, type: Array }) tagList!: TagItem[];
  select(tag: TagItem) {
    this.$emit("update:selectedTag", tag);
  }
  add() {
    this.$router.replace("/tags");
  }
}
</script>

<style lang="scss" scoped>
.tags {
  padding: 14px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: auto;
  &-item {
    width: 25%;
    padding: 6px 0;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-icon {
      width: 40px;
      height: 40px;
      padding: 4px;
      border-radius: 50%;
      background: #f5f5f5;
      margin-bottom: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.selected {
        background: #77dba6;
      }
      svg {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
