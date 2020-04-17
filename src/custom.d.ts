type TagItem = {
  name: string;
  value: string;
};
type RecordItem = {
  id?: number;
  tag: TagItem;
  type: string;
  note: string;
  amount: number;
  createAt?: Date;
};
type TabBarItem = {
  name: string;
  value: string;
};
