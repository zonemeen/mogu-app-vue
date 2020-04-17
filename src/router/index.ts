import Vue from "vue";
import VueRouter from "vue-router";
import Money from "@/views/Money.vue";
import Bill from "@/views/Bill.vue";
import Charts from "@/views/Charts.vue";
import NotFound from "@/views/NotFound.vue";
import Tags from "@/views/Tags.vue";
import EditRecord from '@/views/EditRecord.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/bill"
  },
  {
    path: "/bill",
    component: Bill
  },
  {
    path: "/money",
    component: Money
  },
  {
    path: "/tags",
    component: Tags
  },
  {
    path: "/charts",
    component: Charts
  },
  {
    path: '/record/edit/:id',
    component: EditRecord
  },
  {
    path: "/*",
    component: NotFound
  }
];

const router = new VueRouter({
  routes
});

export default router;
