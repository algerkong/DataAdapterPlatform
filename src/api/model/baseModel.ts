export interface BaseListModel<T> {
  list: Array<T>;
  total: number;
}

export interface RequestListParams {
  [key: string]: any;
  page?: number;
  pageSize?: number;
}
