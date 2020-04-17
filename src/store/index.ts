import Vue from "vue";
import Vuex from "vuex";
import { defaultExpenseTags } from "@/constants/defaultTags";
import idCreator from "@/lib/idCreator";

Vue.use(Vuex);

type storeState = {
  tagList: TagItem[];
  recordList: RecordItem[];
  tagListError: "" | "duplicate";
  currentRecord: RecordItem | undefined;
  recordListError: "" | "notfound";
};

const store = new Vuex.Store({
  state: {
    tagList:
      JSON.parse(window.localStorage.getItem("tag-list") || "0") ||
      defaultExpenseTags,
    recordList: JSON.parse(window.localStorage.getItem("record-list") || "[]"),
    tagListError: "",
    currentRecord: undefined,
    recordListError: ""
  } as storeState,
  mutations: {
    insertRecord(state, record: RecordItem) {
      record.id = idCreator();
      record.createAt = new Date();
      record.amount = Math.abs(record.amount); // 保证金额为正
      state.recordList.push(record);
      store.commit("saveRecord");
    },
    findRecord(state, id: number) {
      state.currentRecord = undefined;
      const record = state.recordList.filter(item => item.id === id)[0];
      if (record) {
        state.currentRecord = record;
      }
    },
    updateRecord(state, payload: { id: number; record: RecordItem }) {
      const { id, record } = payload;
      let index = 0;
      for (index = 0; index < state.recordList.length; index++) {
        if (state.recordList[index].id === id) {
          state.recordList[index] = record;
          break;
        }
      }
      store.commit("saveRecord");
    },
    removeRecord(state, id: number) {
      state.recordListError = "";
      let index = 0;
      for (index = 0; index < state.recordList.length; index++) {
        if (state.recordList[index].id === id) {
          break;
        }
      }
      if (index === state.recordList.length) {
        state.recordListError = "notfound";
      } else {
        state.recordList.splice(index, 1);
        store.commit("saveRecord");
      }
    },
    saveRecord(state) {
      window.localStorage.setItem(
        "record-list",
        JSON.stringify(state.recordList)
      );
    },
    insertTag(state, tag: TagItem) {
      state.tagListError = "";
      const names = state.tagList.map(item => item.name);
      if (names.indexOf(tag.name) >= 0) {
        state.tagListError = "duplicate";
        return;
      } else {
        state.tagList.push(tag);
        store.commit("saveTag");
      }
    },
    saveTag(state) {
      window.localStorage.setItem("tag-list", JSON.stringify(state.tagList));
    }
  }
});

export default store;
