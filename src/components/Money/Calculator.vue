<template>
  <div class="calculator" :class="classPrefix && `${classPrefix}-calculator`">
    <label class="note">
      <span class="icon">
        <Icon name="note" />
      </span>
      <span>备注:</span>
      <input
        type="text"
        style="font-size: 11px"
        placeholder="写点备注吧~"
        :value="note"
        @input="writeNote($event.target.value)"
      />
    </label>
    <div class="panel">{{ output }}</div>
    <div class="number-pad">
      <button
        v-for="(name, index) in buttonList"
        :key="index"
        :class="name === '完成' && 'ok'"
        @click="handle(name)"
      >
        {{ name }}
      </button>
      <button @click="remove">
        <Icon name="delete" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Icon from "@/components/Icon.vue";

@Component({
  components: { Icon },
})
export default class Calculator extends Vue {
  @Prop(String) classPrefix?: string;
  @Prop({ required: true, type: String }) note!: string;
  @Prop({ required: true, type: Number }) amount!: string;
  buttonList: string[] = [
    "1",
    "2",
    "3",
    "+",
    "4",
    "5",
    "6",
    "-",
    "7",
    "8",
    "9",
    "完成",
    ".",
    "0",
  ];
  output = "0";
  dot = true;
  // 有效数字最多为.前6位.后2位
  validNumberBeforeDot = 6;
  validNumberAfterDot = 2;
  // 记录运算
  beforeNumber = 0;
  beforeIndex = 0;
  operator = "";

  writeNote(note: string) {
    this.$emit("update:note", note);
  }

  handle(button: string) {
    if (button !== "完成") {
      this.handleInput(button);
    } else {
      this.complete();
    }
  }

  handleInput(button: string) {
    // 最大有效位数21位
    if (this.output.length >= 21) {
      return;
    }
    // 数字不能以0开头(除了小数)
    if (this.output === "0") {
      if ("0123456789".indexOf(button) >= 0) {
        this.output = button;
        this.validNumberBeforeDot -= 1;
      } else if (button === ".") {
        this.output += button;
        this.dot = false;
      }
      return;
    }

    // 处理输入为点
    if (button === ".") {
      return this.handleDot();
    }
    // 处理数字
    if ("0123456789".indexOf(button) >= 0) {
      return this.handleNumber(button);
    }
    // 处理运算符
    if ("+-".indexOf(button) >= 0) {
      return this.handleOperator(button);
    }
  }

  handleDot() {
    if (this.dot) {
      this.output += ".";
      this.dot = false;
    }
  }

  handleNumber(num: string) {
    if (this.dot && this.validNumberBeforeDot > 0) {
      this.output += num;
      this.validNumberBeforeDot -= 1;
    } else if (!this.dot && this.validNumberAfterDot > 0) {
      this.output += num;
      this.validNumberAfterDot -= 1;
    }
  }

  handleOperator(operator: string) {
    const last = this.output.slice(-1);
    // 不合法输入
    if (".+-".indexOf(last) >= 0) {
      return;
    } else {
      if (this.operator !== "") {
        // 对上一个表达式进行运算
        this.calculate();
        this.operator = operator;
        this.reset();

        this.beforeNumber = this.handleError(this.beforeNumber);
        this.output = this.beforeNumber.toString() + operator;
        this.beforeIndex = this.output.length;
        return;
      } else {
        // 记录上一个数
        this.beforeNumber = parseFloat(this.output);
        this.operator = operator;
        this.output += operator;
        this.beforeIndex = this.output.length;
        return;
      }
    }
  }

  // 处理舍入误差
  handleError(value: number) {
    const integer = value.toString().split(".")[0];
    let decimal = value.toString().split(".")[1];
    let wholeNumber: string;
    if (decimal) {
      // 有效位
      const index = decimal.indexOf("999999");
      if (index >= 0) {
        decimal = decimal.slice(0, index);
        const last = decimal.slice(-1);
        decimal = decimal.slice(0, -1) + (parseInt(last) + 1).toString();
      }
      if (decimal.length > 2) {
        decimal = decimal.slice(0, 2); // 只保留2位
      }
      wholeNumber = [integer, decimal].join(".");
    } else {
      wholeNumber = integer;
    }
    return parseFloat(wholeNumber);
  }

  // 计算
  calculate() {
    const afterNumber = parseFloat(this.output.slice(this.beforeIndex));
    if (this.operator === "+") {
      this.beforeNumber = this.beforeNumber + afterNumber;
    } else if (this.operator === "-") {
      this.beforeNumber = this.beforeNumber - afterNumber;
    }
  }

  complete() {
    if (this.output === "0" || this.output === "0.") {
      alert("请输入金额!");
      return;
    }
    const last = this.output.slice(-1);
    if (
      (this.output.indexOf("+") >= 0 || this.output.indexOf("-") >= 0) &&
      "+-".indexOf(last) < 0
    ) {
      this.calculate();
      this.beforeNumber = this.handleError(this.beforeNumber);
    } else {
      this.beforeNumber = parseFloat(this.output);
    }
    this.$emit("update:amount", this.beforeNumber);
    this.output = "0";
    this.$emit("complete");
  }

  remove() {
    if (this.output.length > 1) {
      const last = this.output.slice(-1);
      if (last === ".") {
        this.dot = true;
      } else if ("+-".indexOf(last) >= 0) {
        this.operator = "";
      } else if ("0123456789".indexOf(last) >= 0) {
        if (this.dot) {
          this.validNumberBeforeDot += 1;
        } else {
          this.validNumberAfterDot += 1;
        }
      }
      this.output = this.output.slice(0, -1);
    } else {
      this.output = "0";
      this.reset();
    }
  }

  reset() {
    this.dot = true;
    this.validNumberBeforeDot = 6;
    this.validNumberAfterDot = 2;
  }

  @Watch("operator")
  onOperator(val: string) {
    // 操作符被删除
    if (val === "") {
      // 重置 dot 以及 validNumber 状态
      if (this.beforeNumber.toString().indexOf(".") >= 0) {
        this.dot = false;
        const integer = this.beforeNumber.toString().split(".")[0];
        const decimal = this.beforeNumber.toString().split(".")[1];
        this.validNumberBeforeDot = 6 - integer.length;
        this.validNumberAfterDot = 2 - decimal.length;
      } else {
        this.dot = true;
        this.validNumberBeforeDot = 6 - this.beforeNumber.toString().length;
        this.validNumberAfterDot = 2;
      }
    } else {
      // 有新的操作符
      // dot 及 validNumber置为初始状态
      this.reset();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";

.calculator {
  .note {
    display: flex;
    align-items: center;
    padding: 5px 8px;
    font-size: 11px;
    border-top: 1px solid #f5f5f5;
    background: lighten(#f5f5f5, 4%);

    .icon {
      margin-right: 2px;
    }

    span {
      white-space: nowrap;
    }

    input {
      flex-grow: 1;
      margin-left: 8px;
      height: 24px;
      border: none;
      background: inherit;
    }
  }

  .panel {
    background: #f5f5f5;
    padding: 11px 11px;
    font-size: 18px;
    line-height: 18px;
    font-family: Consolas, monospace;
    text-align: right;
  }

  .number-pad {
    @extend %clear-fix;

    button {
      $h: 44px;
      float: left;
      width: 25%;
      height: $h;
      font-size: 12px;
      border: none;

      &.ok {
        float: right;
        height: $h * 2;
      }

      $bg: #f2f2f2;

      &:nth-child(1) {
        background: $bg;
      }

      &:nth-child(2),
      &:nth-child(5) {
        background: darken($bg, 4%);
      }

      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(9) {
        background: darken($bg, 4 * 2%);
      }

      &:nth-child(4),
      &:nth-child(7),
      &:nth-child(10),
      &:nth-child(13) {
        background: darken($bg, 4 * 3%);
      }

      &:nth-child(8),
      &:nth-child(11),
      &:nth-child(14) {
        background: darken($bg, 4 * 4%);
      }

      &:nth-child(15) {
        background: darken($bg, 4 * 5%);
      }

      &:nth-child(12) {
        background: darken($bg, 4 * 6%);
      }
    }
  }
}
</style>
