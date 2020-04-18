<template>
  <div class="tags">
    <div class="fixed">
      <header class="header">
        <div class="title">
          <button class="back" @click="back">
            <Icon name="left" />
          </button>
          <span class="addTags">添加支出类别</span>
        </div>
        <button class="ok" @click="ok">保存</button>
      </header>
      <div class="current">
        <div class="label">
          <span class="choose">选中标签:</span>
          <div class="icon">
            <Icon :name="tag.name" />
          </div>
        </div>
        <span>{{ tag.value }}</span>
      </div>
    </div>
    <div class="content">
      <div class="food">
        <div class="kind-name">餐饮</div>
        <TagList
          class-prefix="main"
          :tag-list="foodTags"
          :selected-tag.sync="tag"
        />
      </div>
      <div class="shopping">
        <div class="kind-name">购物</div>
        <TagList
          class-prefix="main"
          :tag-list="shoppingTags"
          :selected-tag.sync="tag"
        />
      </div>
      <div class="transport">
        <div class="kind-name">交通</div>
        <TagList
          class-prefix="main"
          :tag-list="transportTags"
          :selected-tag.sync="tag"
        />
      </div>
      <div class="house">
        <div class="kind-name">居住</div>
        <TagList
          class-prefix="main"
          :tag-list="houseTags"
          :selected-tag.sync="tag"
        />
      </div>
      <div class="entertainment">
        <div class="kind-name">娱乐</div>
        <TagList
          class-prefix="main"
          :tag-list="entertainmentTags"
          :selected-tag.sync="tag"
        />
      </div>
      <div class="medical">
        <div class="kind-name">医疗</div>
        <TagList
          class-prefix="main"
          :tag-list="medicalTags"
          :selected-tag.sync="tag"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Layout from "@/components/Layout.vue";
import TagList from "@/components/Money/TagList.vue";
import {
  entertainmentTags,
  foodTags,
  houseTags,
  medicalTags,
  shoppingTags,
  transportTags
} from "@/constants/defaultTags";
import Icon from "@/components/Icon.vue";
import clone from "@/lib/clone";

@Component({
  components: { Icon, TagList, Layout }
})
export default class Label extends Vue {
  tag: TagItem = { name: "food", value: "餐饮" };
  foodTags = foodTags;
  shoppingTags = shoppingTags;
  transportTags = transportTags;
  houseTags = houseTags;
  entertainmentTags = entertainmentTags;
  medicalTags = medicalTags;

  get tagList() {
    return this.$store.state.tagList;
  }

  back() {
    this.$router.replace("/money");
  }

  ok() {
    this.$store.commit("insertTag", clone(this.tag));
    if (this.$store.state.tagListError === "duplicate") {
      window.alert("不可添加同名的标签类别");
    } else {
      this.$router.replace("/money");
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin icon($color) {
  background: white;
  border: 1px solid transparent;
  color: $color;
  svg {
    width: 24px;
    height: 24px;
  }
  &.selected {
    border: 1px solid $color;
  }
}

::v-deep {
  .main-tags > li:nth-child(4n + 0) {
    .main-tags-item-icon {
      @include icon(#a4d09f);
    }
  }

  .main-tags > li:nth-child(4n + 1) {
    .main-tags-item-icon {
      @include icon(#f7d680);
    }
  }

  .main-tags > li:nth-child(4n + 2) {
    .main-tags-item-icon {
      @include icon(#b84e52);
    }
  }

  .main-tags > li:nth-child(4n + 3) {
    .main-tags-item-icon {
      @include icon(#5079c8);
    }
  }
}
.tags {
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
  }
}

.header {
  background: #3eb575;
  font-size: 20px;
  line-height: 24px;
  padding: 12px 16px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    display: flex;
    align-items: center;

    .back {
      svg {
        width: 20px;
        height: 20px;
      }

      background: inherit;
      border: none;
      margin-right: 8px;
    }
    .addTags {
      font-size: 16px;
    }
  }

  .ok {
    font-size: 16px;
    // color: red;
    border: none;
    background: inherit;
  }
}

.current {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  box-shadow: inset 0 -1px 1px -1px rgba(0, 0, 0, 0.3);

  .label {
    display: flex;
    align-items: center;
    .choose {
      margin-right: 8px;
    }
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #77dba6;
      border: 1px solid #77dba6;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
}

.content {
  padding-top: 120px;
}

.kind-name {
  font-size: 14px;
  color: #999999;
}
</style>
