<template>
  <Layout>
    <header class="header">
      <TabBar class-prefix="types" :bars="typeList" :c-bar.sync="type" />
      <TabBar
        class-prefix="interval"
        :bars="intervalList"
        :c-bar.sync="interval"
      />
    </header>
    <div class="chart">
      <div class="caption">
        <span v-if="interval === 'week'">本周</span>
        <span v-else-if="interval === 'month'">本月</span>
        <span v-else>今年</span>
      </div>
      <div class="total">
        <span v-if="type === '-'">总支出: ¥{{ total }}</span>
        <span v-else>总收入: ¥{{ total }}</span>
      </div>
      <div class="average">平均值: ¥{{ average }}</div>
      <div id="figure"></div>
    </div>
    <div class="ranking">
      <div class="caption">
        <span>支出排行榜</span>
      </div>
      <ul class="tag-list" v-if="targetRecords.length > 0">
        <li
          class="tag-item"
          v-for="(item, index) in this.groupByTag()"
          :key="index"
        >
          <div class="tag-info">
            <div class="icon">
              <Icon :name="item.tag.name" />
            </div>
            <span>{{ item.tag.value }}</span>
            <span>{{ item.percentage }}%</span>
          </div>
          <div>{{ item.amount }}</div>
        </li>
      </ul>
      <div v-else class="reverse">
        <Blank />
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Layout from "@/components/Layout.vue";
import echarts from "echarts";
import TabBar from "@/components/TabBar.vue";
import Icon from "@/components/Icon.vue";
import dayjs from "dayjs";
import clone from "@/lib/clone";
import { twoDecimalPlaces } from "@/lib/decimal";
import Blank from "@/components/Blank.vue";

type Group = {
  tag: TagItem;
  amount: number;
  percentage: number;
};

@Component({
  components: { Blank, Icon, TabBar, Layout },
})
export default class Charts extends Vue {
  typeList: TabBarItem[] = [
    { name: "支出", value: "-" },
    { name: "收入", value: "+" },
  ];
  intervalList: TabBarItem[] = [
    { name: "周", value: "week" },
    { name: "月", value: "month" },
    { name: "年", value: "year" },
  ];

  type: "+" | "-" = "-";
  interval: "week" | "month" | "year" = "week";

  get targetRecords(): RecordItem[] {
    const now = dayjs();
    return clone<RecordItem[]>(this.$store.state.recordList)
      .filter((item) => item.type === this.type)
      .filter((item) => dayjs(item.createAt).isSame(now, this.interval));
  }

  get total() {
    const amounts = [...this.groupByInterval().values()];
    let sum = 0;
    for (let i = 0; i < amounts.length; i++) {
      sum += amounts[i];
    }
    return sum;
  }

  get average() {
    const now = dayjs();
    switch (this.interval) {
      case "week":
        return twoDecimalPlaces(this.total / (now.day() + 3));
      case "month":
        return twoDecimalPlaces(this.total / (now.date() + 7));
      case "year":
        return twoDecimalPlaces(this.total / (now.month() + 1));
      default:
        return 0;
    }
  }

  groupByInterval(): Map<string, number> {
    let result = new Map<string, number>();
    switch (this.interval) {
      case "week":
        result = this.groupByWeek(this.targetRecords);
        break;
      case "month":
        result = this.groupByMonth(this.targetRecords);
        break;
      case "year":
        result = this.groupByYear(this.targetRecords);
        break;
    }
    return result;
  }

  groupByTag(): Group[] {
    const tags: string[] = [];
    let result: Group[] = [];
    let r: RecordItem;
    for (r of this.targetRecords) {
      const index = tags.indexOf(r.tag.name);
      if (index < 0) {
        tags.push(r.tag.name);
        result.push({ tag: r.tag, amount: r.amount, percentage: 0 });
      } else {
        result[index].amount += r.amount;
      }
    }
    for (let i = 0; i < result.length; i++) {
      result[i].percentage = twoDecimalPlaces(
        (result[i].amount * 100) / this.total
      );
    }
    result = result.sort((b, a) => a.percentage - b.percentage);
    return result;
  }

  get days() {
    const [year, month] = [dayjs().year(), dayjs().month()];
    const d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (
      (year % 4 === 0 && year % 100 !== 0) ||
      (year % 100 === 0 && year % 400 === 0)
    ) {
      if (month === 1) {
        return 29;
      } else {
        return d[month];
      }
    } else {
      return d[month];
    }
  }

  groupByWeek(records: RecordItem[]): Map<string, number> {
    const keys = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const result = new Map<string, number>();
    let i: number;
    // 初始化
    for (i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let r: RecordItem;
    for (r of records) {
      const key = keys[dayjs(r.createAt).day()];
      const amount = result.get(key) as number;
      result.set(key, amount + r.amount);
    }
    return result;
  }

  groupByMonth(records: RecordItem[]): Map<string, number> {
    const keys: string[] = [];
    const result = new Map<string, number>();
    let i: number;
    // 初始化
    for (i = 1; i < this.days; i++) {
      keys.push(i.toString());
    }
    for (i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let r: RecordItem;
    for (r of records) {
      const key = dayjs(r.createAt)
        .date()
        .toString();
      const amount = result.get(key) as number;
      result.set(key, amount + r.amount);
    }
    return result;
  }

  groupByYear(records: RecordItem[]): Map<string, number> {
    const keys = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
    const result = new Map<string, number>();
    let i: number;
    // 初始化
    for (i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let r: RecordItem;
    for (r of records) {
      const key = keys[dayjs(r.createAt).month()];
      const amount = result.get(key) as number;
      result.set(key, amount + r.amount);
    }
    return result;
  }

  toArray(value: number, length: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < length; i++) {
      result.push(value);
    }
    return result;
  }

  draw(data: Map<string, number>) {
    // 提取变量
    const x = [...data.keys()];
    const y = [...data.values()];

    const figure = echarts.init(
      document.getElementById("figure") as HTMLDivElement
    );
    figure.setOption({
      grid: {
        top: "5%",
        bottom: "10%",
      },
      xAxis: {
        data: x,
        axisTick: {
          interval: 0,
          lineStyle: {
            opacity: 0,
          },
        },
        axisLabel: {
          interval: 0,
          fontSize: 8,
          color: "#999999",
        },
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            opacity: 0,
          },
        },
        splitLine: {
          lineStyle: {
            opacity: 0,
          },
        },
        axisLabel: undefined,
        axisTick: undefined,
      },
      series: [
        {
          type: "line",
          data: y,
        },
        {
          name: "平均线",
          type: "line",
          data: this.toArray(this.average, x.length),
          symbol: "none",
          lineStyle: {
            type: "dashed",
            color: "#999999",
            width: 1,
            opacity: 0.5,
          },
        },
        {
          name: "最大值",
          type: "line",
          data: this.toArray(Math.max(...y), x.length),
          symbol: "none",
          lineStyle: {
            color: "#999999",
            width: 1,
            opacity: 0.5,
          },
        },
      ],
    });
  }

  mounted() {
    this.draw(this.groupByInterval());
  }

  @Watch("type")
  onTypeChang() {
    this.draw(this.groupByInterval());
  }

  @Watch("interval")
  onIntervalChange() {
    this.draw(this.groupByInterval());
  }
}
</script>

<style lang="scss" scoped>
.header {
  background: #3eb575;
  padding: 9px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  width: 100%;

  .type {
    font-size: 20px;
    padding: 4px 8px;
  }

  ::v-deep {
    .interval-tab-bar {
      margin: 12px 10px;

      .interval-tab-bar-item {
        font-size: 14px;
        width: 70px;
        border: 1px solid #333333;

        &:first-child {
          border-radius: 8px 0 0 8px;
        }

        &:last-child {
          border-radius: 0 8px 8px 0;
        }

        &.selected {
          background: #333333;
          color: #3eb575;
        }
      }
    }
  }
  ::v-deep {
    .types-tab-bar {
      .types-tab-bar-item {
        font-size: 14px;
        width: 50px;
        border: 1px solid #333333;

        &:first-child {
          border-radius: 8px 0 0 8px;
        }

        &:last-child {
          border-radius: 0 8px 8px 0;
        }

        &.selected {
          background: #333333;
          color: #3eb575;
        }
      }
    }
  }
}

.chart {
  padding: 70px 0 6px;
  border-bottom: 1px solid #dddddd;

  .caption {
    border-bottom: 1px solid #dddddd;
    display: flex;

    span {
      padding: 8px 16px;
      font-size: 14px;
    }
  }

  .total {
    font-size: 14px;
    color: #999999;
    text-align: left;
    padding: 6px 6px;
  }

  .average {
    font-size: 12px;
    color: #999999;
    text-align: left;
    padding: 0 6px;
    margin-bottom: 16px;
  }

  #figure {
    width: 100%;
    height: 150px;
  }
}

.ranking {
  .caption {
    text-align: left;
    font-size: 14px;
    padding: 6px 16px;
  }

  .tag-list {
    padding: 6px 16px;

    .tag-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      box-shadow: inset 0 -1px 1px -1px rgba(0, 0, 0, 0.1);
      font-size: 14px;

      .tag-info {
        display: flex;
        align-items: center;

        .icon {
          background: #f5f5f5;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8px;

          svg {
            width: 24px;
            height: 24px;
          }
        }

        span {
          margin-right: 8px;
          line-height: 32px;
        }
      }
    }
  }
}
.reverse {
  margin-top: 36px;
}
</style>
