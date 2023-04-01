import { ApiConfigModel } from './model/apiConfigModel';
import { RequestListParams, BaseListModel } from './model/baseModel';
import { request } from '@/utils/request';

const Api = '/api_config_item';

export const getApiConfigList = (params: RequestListParams) => {
  return request.get<BaseListModel<ApiConfigModel>>({
    url: Api,
    params,
  });
};

export const getApiConfig = (id: string) => {
  return request.get<ApiConfigModel>({
    url: `${Api}/${id}`,
  });
};

export const addApiConfig = (data: ApiConfigModel) => {
  return request.post<ApiConfigModel>({
    url: Api,
    data,
  });
};

export const editApiConfig = (id: string, data: ApiConfigModel) => {
  return request.patch<ApiConfigModel>({
    url: `${Api}/${id}`,
    data,
  });
};

export const delApiConfig = (id: string) => {
  return request.delete<ApiConfigModel>({
    url: `${Api}/${id}`,
  });
};
