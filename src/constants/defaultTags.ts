const defaultExpenseTags = [
  { name: "food", value: "餐饮" },
  { name: "shopping", value: "购物" },
  { name: "necessary", value: "日用" },
  { name: "transport", value: "交通" },
  { name: "house", value: "居住" },
  { name: "entertainment", value: "娱乐" },
] as TagItem[];

const defaultIncomeTags = [
  { name: "salary", value: "工资" },
  { name: "part-time", value: "兼职" },
  { name: "bonus", value: "理财" },
  { name: "gift", value: "礼金" },
  { name: "reimbursement", value: "其它" },
] as TagItem[];

const foodTags = [
  { name: "food", value: "餐饮" },
  { name: "rice", value: "午餐/晚餐" },
  { name: "outgoing", value: "外卖" },
  { name: "vegetables", value: "买菜" },
  { name: "snacks", value: "零食" },
  { name: "barbecue", value: "小吃" },
  { name: "wine", value: "酒水" },
] as TagItem[];

const shoppingTags = [
  { name: "shopping", value: "购物" },
  { name: "necessary", value: "日用" },
  { name: "cloth", value: "衣服" },
  { name: "digital", value: "数码" },
  { name: "device", value: "电器" },
  { name: "furnishing", value: "家居" },
  { name: "cosmetic", value: "化妆品" },
] as TagItem[];

const transportTags = [
  { name: "transport", value: "交通" },
  { name: "bus", value: "公交" },
  { name: "subway", value: "地铁" },
  { name: "train", value: "火车" },
  { name: "plane", value: "飞机" },
  { name: "taxi", value: "出租车" },
] as TagItem[];

const houseTags = [
  { name: "house", value: "居住" },
  { name: "phone", value: "话费网费" },
  { name: "water", value: "水电费" },
  { name: "fix", value: "维修" },
] as TagItem[];

const entertainmentTags = [
  { name: "entertainment", value: "娱乐" },
  { name: "game", value: "游戏" },
  { name: "movie", value: "电影" },
  { name: "sport", value: "运动" },
  { name: "travel", value: "旅游" },
] as TagItem[];

const medicalTags = [
  { name: "medical", value: "医疗" },
  { name: "drug", value: "药品费" },
  { name: "surgery", value: "手术费" },
];

export {
  defaultExpenseTags,
  defaultIncomeTags,
  foodTags,
  shoppingTags,
  transportTags,
  houseTags,
  entertainmentTags,
  medicalTags,
};
