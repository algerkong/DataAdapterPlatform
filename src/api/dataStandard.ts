import { DataStandardModel } from './model/dataStandardModel';
import { RequestListParams, BaseListModel } from './model/baseModel';
import { request } from '@/utils/request';

const Api = '/data_standard';
export const getDataStandardList = (params?: RequestListParams) => {
  return request.get<BaseListModel<DataStandardModel>>({
    url: Api,
    params,
  });
};

export const addDataStandard = (data: DataStandardModel) => {
  return request.post({
    url: Api,
    data,
  });
};

export const delDataStandard = (id: string) => {
  return request.delete({
    url: `${Api}/${id}`,
  });
};

export const editDataStandard = (id: string, data: DataStandardModel) => {
  return request.patch({
    url: `${Api}/${id}`,
    data,
  });
};

export const getDataStandard = (id: string) => {
  return request.get<DataStandardModel>({
    url: `${Api}/${id}`,
  });
};
