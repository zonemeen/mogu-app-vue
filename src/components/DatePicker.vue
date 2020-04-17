<template>
  <div class="date-picker">
    <div class="year">
      <select v-model="year">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <span>年</span>
    </div>
    <div class="month">
      <select v-model="month">
        <option v-for="m in 12" :key="m" :value="m">{{ beautify(m) }}</option>
      </select>
      <span>月</span>
    </div>
    <div class="day">
      <select v-model="date">
        <option v-for="d in days" :key="d" :value="d">{{ beautify(d) }}</option>
      </select>
      <span>日</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import dayjs from "dayjs";

@Component
export default class DatePicker extends Vue {
  @Prop(String) initialDate?: string;
  year = dayjs(this.initialDate).year();
  month = dayjs(this.initialDate).month() + 1;
  date = dayjs(this.initialDate).date();

  get years() {
    const endYear = dayjs().year();
    let y = 1970;
    const result: number[] = [];
    while (y <= endYear) {
      result.push(y);
      y++;
    }
    return result;
  }

  get days(): number {
    const d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 判断是否为闰年
    if (
      (this.year % 4 === 0 && this.year % 100 !== 0) ||
      (this.year % 100 === 0 && this.year % 400 === 0)
    ) {
      if (this.month === 2) {
        return 29;
      } else {
        return d[this.month - 1];
      }
    } else {
      return d[this.month - 1];
    }
  }

  beautify(m: number) {
    return m < 10 ? "0" + m.toString() : m.toString();
  }

  @Watch("year")
  onYearChange(year: number) {
    this.$emit("update:year", year);
  }

  @Watch("month")
  onMonthChange(month: number) {
    this.$emit("update:month", month);
  }

  @Watch("date")
  onDateChange(date: number) {
    this.$emit("update:date", date);
  }
}
</script>

<style lang="scss" scoped>
.date-picker {
  display: flex;
  align-items: center;
  font-size: inherit;
  height: 40px;
  select {
    font-size: inherit;
  }
}
</style>
