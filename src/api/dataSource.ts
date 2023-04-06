import { DataSourceModel } from './model/dataSourceModel';
import { RequestListParams, BaseListModel } from './model/baseModel';
import { request } from '@/utils/request';

const Api = '/data_source';

export const getDataSourceList = (params?: RequestListParams) => {
  return request.get<BaseListModel<DataSourceModel>>({
    url: Api,
    params: params || {},
  });
};

export const addDataSource = (data: DataSourceModel) => {
  return request.post({
    url: Api,
    data,
  });
};

export const delDataSource = (id: string) => {
  return request.delete({
    url: `${Api}/${id}`,
  });
};

export const editDataSource = (id: string, data: DataSourceModel) => {
  return request.patch({
    url: `${Api}/${id}`,
    data,
  });
};

export const getDataSource = (id: string) => {
  return request.get<DataSourceModel>({
    url: `${Api}/${id}`,
  });
};
