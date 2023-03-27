import { SystemModel } from './model/system';
import { RequestListParams, BaseListModel } from './model/baseModel';
import { request } from '@/utils/request';

const Api = {
  system: '/system',
};

export const getSystemList = (parms: RequestListParams) => {
  return request.get<BaseListModel<SystemModel>>({
    url: Api.system,
    params: parms,
  });
};

export const addSystem = (data: SystemModel) => {
  return request.post({
    url: Api.system,
    data,
  });
};

export const delSystem = (id: string) => {
  return request.delete({
    url: `${Api.system}/${id}`,
  });
};

export const editSystem = (id: string, data: SystemModel) => {
  return request.patch({
    url: `${Api.system}/${id}`,
    data,
  });
};

export const systemOn = (id: string) => {
  return request.post({
    url: `${Api.system}/on/${id}`,
  });
};

export const systemOff = (id: string) => {
  return request.post({
    url: `${Api.system}/off/${id}`,
  });
};
