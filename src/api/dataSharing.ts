import { request } from '@/utils/request';

const Api = {
  dataSharing: '/share_data',
};

export const getDataSharingList = (parms: any) => {
  return request.get({
    url: Api.dataSharing,
    params: parms,
  });
};

export const addSystem = (data: any) => {
  return request.post({
    url: Api.dataSharing,
    data,
  });
};

export const delSystem = (id: string) => {
  return request.delete({
    url: `${Api.dataSharing}/${id}`,
  });
};

export const editSystem = (id: string, data: any) => {
  return request.patch({
    url: `${Api.dataSharing}/${id}`,
    data,
  });
};
