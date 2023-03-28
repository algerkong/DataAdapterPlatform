import { dataStandardModel } from './model/dataStandardModel';
import { RequestListParams, BaseListModel } from './model/baseModel';
import { request } from '@/utils/request';

const Api = '/data_standard';
export const getDataStandardList = (params: RequestListParams) => {
  return request.get<BaseListModel<dataStandardModel>>({
    url: Api,
    params,
  });
};

export const addDataStandard = (data: dataStandardModel) => {
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

export const editDataStandard = (id: string, data: dataStandardModel) => {
  return request.patch({
    url: `${Api}/${id}`,
    data,
  });
};

export const getDataStandard = (id: string) => {
  return request.get<dataStandardModel>({
    url: `${Api}/${id}`,
  });
};
