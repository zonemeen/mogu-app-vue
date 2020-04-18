<template>
  <div class="edit">
    <header class="header">
      <button class="back" @click="back">
        <Icon name="left" />
      </button>
      <div class="tag">
        <div class="icon">
          <Icon :name="record.tag.name" />
        </div>
        <span class="value">{{ record.tag.value }}</span>
      </div>
      <div class="back"></div>
    </header>
    <main>
      <ul class="main">
        <li>
          <label>
            <span class="name">类型</span>
            <div class="type">{{ record.type === "-" ? "支出" : "收入" }}</div>
          </label>
        </li>
        <li>
          <label>
            <span class="name">金额</span>
            <input type="text" v-model="record.amount" />
          </label>
        </li>
        <li>
          <label class="date">
            <span class="name">日期</span>
            <DatePicker
              :initial-date="dayjs(record.createAt).toISOString()"
              @update:year="updateYear"
              @update:month="updateMonth"
              @update:date="updateDate"
            />
          </label>
        </li>
        <li>
          <label>
            <span class="name">备注</span>
            <input type="text" v-model="record.note" />
          </label>
        </li>
      </ul>
    </main>
    <footer class="footer">
      <button @click="ok">编辑完成</button>
      <button @click="remove">删除</button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Icon from "@/components/Icon.vue";
import DatePicker from "@/components/DatePicker.vue";
import dayjs from "dayjs";
import clone from "@/lib/clone";

@Component({
  components: { DatePicker, Icon }
})
export default class EditRecord extends Vue {
  record?: RecordItem;
  dayjs = dayjs;

  created() {
    this.$store.commit("findRecord", parseInt(this.$route.params.id));
    this.record = clone<RecordItem>(this.$store.state.currentRecord);
    if (!this.record) {
      this.record = {
        id: 0,
        tag: { name: "food", value: "餐饮" },
        type: "-",
        note: "",
        amount: 0,
        createAt: new Date()
      }; // 消除Vue warn
      this.$router.replace("/error");
    }
  }

  updateYear(year: number) {
    if (this.record) {
      this.record.createAt = dayjs(this.record.createAt)
        .year(year)
        .toDate();
    }
  }

  updateMonth(month: number) {
    if (this.record) {
      this.record.createAt = dayjs(this.record.createAt)
        .month(month - 1)
        .toDate();
    }
  }

  updateDate(date: number) {
    if (this.record) {
      this.record.createAt = dayjs(this.record.createAt)
        .date(date)
        .toDate();
    }
  }

  back() {
    this.$router.replace("/");
  }

  ok() {
    if (this.record) {
      this.record.amount = parseFloat(this.record.amount.toString());
      this.$store.commit("updateRecord", {
        id: this.record.id,
        record: this.record
      });
    }
    this.$router.replace("/");
  }

  remove() {
    if (this.record) {
      this.$store.commit("removeRecord", this.record.id);
      if (this.$store.state.recordListError === "notfound") {
        window.alert("该记录不存在");
      } else {
        this.$router.replace("/");
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  height: 100vh;
}

.header {
  background: #3eb575;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  position: fixed;
  width: 100%;

  .back {
    width: 32px;
    height: 32px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .tag {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .icon {
      background: #f5f5f5;
      padding: 6px;
      border-radius: 50%;
      svg {
        width: 32px;
        height: 32px;
      }
    }
  }
}

.main {
  padding-top: 80px;
  font-size: 16px;
  > li {
    margin-left: 16px;
    padding: 12px 0px 12px 16px;
    border-bottom: 1px solid #dddddd;

    > label {
      display: flex;
      align-items: center;

      .name {
        color: #999999;
        margin-right: 16px;
      }

      .type {
        height: 40px;
        display: flex;
        align-items: center;
      }

      input {
        flex-grow: 1;
        height: 40px;
        border: none;
        font-size: inherit;
      }
    }
  }
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #dddddd;
  padding: 0 16px;

  button {
    width: 50%;
    font-size: 14px;
    padding: 4px 0;
    margin: 12px 0;

    &:first-child {
      border-right: 1px solid #dddddd;
    }

    &:last-child {
      color: #ce3035;
    }
  }
}
</style>
