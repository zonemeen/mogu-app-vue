<template>
  <Layout class-prefix="layout">
    {{record}}
    <NumberPad :value.sync="record.amount" />
    <Types :value.sync="record.type" />
    <Notes @update:value="onUpdateNotes" />
    <Tags :data-source.sync="tags" @update:value="onUpdateTags" />
  </Layout>
</template>

<script lang="ts">
import NumberPad from "@/components/Money/NumberPad.vue";
import Types from "@/components/Money/Types.vue";
import Notes from "@/components/Money/Notes.vue";
import Tags from "@/components/Money/Tags.vue";
import Vue from "vue";
import { Component } from "vue-property-decorator";

type Record = {
  tags: string[];
  notes: string;
  type: string;
  amount: number;
};

@Component({
  components: { Tags, Notes, Types, NumberPad }
})
export default class Money extends Vue {
  tags = ["衣", "食", "住", "行"];
  record: Record = {
    tags: [],
    notes: "",
    type: "-",
    amount: 0
  };
  onUpdateTags(value: string[]) {
    this.record.tags = value;
  }
  onUpdateNotes(value: string) {
    this.record.notes = value;
  }
  // onUpdateType(value: string) {
  //   this.record.type = value;
  // }
  // onUpdateAmount(value: string) {
  //   this.record.amount = parseFloat(value);
  // }
}
</script>

<style lang="scss">
.layout-content {
  display: flex;
  flex-direction: column-reverse;
}
</style>
