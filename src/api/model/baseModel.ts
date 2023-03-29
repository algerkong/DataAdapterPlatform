export interface BaseListModel<T> {
  list: T[];
  total: number;
}

export interface RequestListParams {
  [key: string]: any;
  page?: number;
  pageSize?: number;
}
