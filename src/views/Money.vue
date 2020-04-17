<template>
  <Layout>
    <div class="money">
      <div class="types">
        <TabBar
          class-prefix="types"
          :bars="[
          { name: '支出', value: '-' },
          { name: '收入', value: '+' }
        ]"
          :c-bar.sync="record.type"
        />
      </div>
      <TagList
        v-if="record.type === '-'"
        class-prefix="money"
        :dynamic="true"
        :selected-tag.sync="record.tag"
        :tag-list="tagList"
        class="tag-list"
      />
      <TagList
        v-else-if="record.type === '+'"
        class-prefix="money"
        :selected-tag.sync="record.tag"
        :tag-list="incomeTags"
        class="tag-list"
      />
      <Calculator
        class-prefix="money"
        :note.sync="record.note"
        :amount.sync="record.amount"
        @complete="complete"
      />
    </div>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Layout from "@/components/Layout.vue";
import Icon from "@/components/Icon.vue";
import Calculator from "@/components/Money/Calculator.vue";
import TagList from "@/components/Money/TagList.vue";
import clone from "@/lib/clone";
import { defaultIncomeTags } from "@/constants/defaultTags";
import TabBar from "@/components/TabBar.vue";

@Component({
  components: { TabBar, TagList, Calculator, Icon, Layout }
})
export default class Money extends Vue {
  record: RecordItem = this.initRecord();
  incomeTags = defaultIncomeTags;

  get tagList(): TagItem[] {
    return this.$store.state.tagList;
  }

  initRecord(): RecordItem {
    return {
      tag: { name: "food", value: "餐饮" },
      type: "-",
      note: "",
      amount: 0
    };
  }

  complete() {
    this.$store.commit("insertRecord", clone<RecordItem>(this.record));
    this.record = this.initRecord();
    this.$router.replace("/bill");
  }

  @Watch("record.type")
  onTypeChange(type: string) {
    if (type === "+") {
      this.record.tag = { name: "salary", value: "工资" };
    } else if (type === "-") {
      this.record.tag = { name: "food", value: "餐饮" };
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";

::v-deep {
  .money-calculator {
    position: fixed;
    bottom: 48px;
    left: 0;
    width: 100vw;
  }
}

.money {
  .tag-list {
    padding-bottom: 76+56 * 4+12px;
  }
}

.types {
  background: #ffda47;
  display: flex;
  justify-content: center;
  position: relative;

  ::v-deep .types-tab-bar-item {
    padding: 24px 16px 8px 16px;
  }

  .cancel {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    font-size: 14px;
    padding: 24px 16px 8px 16px;
  }
}
</style>
