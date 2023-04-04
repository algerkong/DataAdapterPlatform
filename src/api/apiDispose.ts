import { ApiDisposeModel } from './model/apiDisposeModel';
import { RequestListParams, BaseListModel } from './model/baseModel';
import { request } from '@/utils/request';

const Api = '/transmission_mode_api';

export const getApiDisposeList = (params: RequestListParams) => {
  return request.get<BaseListModel<ApiDisposeModel>>({
    url: Api,
    params,
  });
};

export const getApiDispose = (id: string) => {
  return request.get<ApiDisposeModel>({
    url: `${Api}/${id}`,
  });
};

export const addApiDispose = (data: ApiDisposeModel) => {
  return request.post<ApiDisposeModel>({
    url: Api,
    data,
  });
};

export const editApiDispose = (id: string, data: ApiDisposeModel) => {
  return request.patch<ApiDisposeModel>({
    url: `${Api}/${id}`,
    data,
  });
};

export const delApiDispose = (id: string) => {
  return request.delete({
    url: `${Api}/${id}`,
  });
};
